import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent";
import { useMemo } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

export const useProfile = (id?: string, predicate?: string) => {

    const queryClient = useQueryClient();

    const {data: profile, isLoading: loadingProfile} = useQuery<Profile> ({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data
        },
        enabled: !!id && !predicate//this will cast the id to boolean and we will only execute if we do have id
    })

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id && !predicate
    });

    const {data: followings, isLoading: loadingFollowings} = useQuery<Profile[]>({
        queryKey: ['followings', id, predicate],
        queryFn: async () => {
            const response = await agent.get<Profile[]>(`/profiles/${id}/follow-list?predicate=${predicate}`);
            return response.data;
        },
        enabled: !!id && !!predicate 
    })

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            return response.data;
        },
        onSuccess: async (photo: Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', id]
            });
            queryClient.setQueryData(['user'], (data: User) => {
                if(!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (data: User) => {
                if(!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
        }
    })

    const setMainPhoto = useMutation({
        mutationFn: async(photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`)
        },
        /* The blow onSuccess method works fine -> I raplaced it with onMutate function below to have this as optimistic loading

        onSuccess: (_, photo) => {
            queryClient.setQueryData(['user'], (userData: User) => {
                if(!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                if(!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url
                }
            });
        }
        */
        onMutate: async (photo) => {
            // Cancel outgoing queries to avoid overwriting optimistic updates
            await queryClient.cancelQueries({ queryKey: ['user'] });
            await queryClient.cancelQueries({ queryKey: ['profile', id] });

            // Snapshot the previous values
            const previousUser = queryClient.getQueryData<User>(['user']);
            const previousProfile = queryClient.getQueryData<Profile>(['profile', id]);

            // Optimistically update the cache
            queryClient.setQueryData(['user'], (userData: User | undefined) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url,
                };
            });

            queryClient.setQueryData(['profile', id], (profile: Profile | undefined) => {
                if (!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url,
                };
            });

            // Return context for rollback
            return { previousUser, previousProfile };
        },

        onError: (_error, _photo, context) => {
            // Roll back if the mutation fails
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }

            if (context?.previousProfile) {
                queryClient.setQueryData(['profile', id], context.previousProfile);
            }
        },

        onSuccess: () => {
            // Optional: invalidate queries to sync with the server
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['profile', id] });
        },                                        
    }) //end of on useMutation function with implemented onMutate method to have optimistic loading.

    const deletePhoto = useMutation({
        mutationFn: async(photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`)
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    })

    const updateFollowing = useMutation({
        mutationFn: async () => {
            await agent.post(`/profiles/${id}/follow`)
        },
        onSuccess: () => {
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                queryClient.invalidateQueries({queryKey: ['followings', id, 'followers']})
                if (!profile || profile.followersCount === undefined) return profile;
                return {
                    ...profile, 
                    following: !profile.following,
                    followersCount: profile.following
                         ? profile.followersCount -1
                         : profile.followersCount +1
                }

            })
        }
    })

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id
    }, [id, queryClient])

    const updateProfile = useMutation({
        mutationFn: async (profile: EditProfileSchema) => {
            await agent.put(`/profiles`, profile);
        },
        onSuccess: (_, profile) => {
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    displayName: profile.displayName,
                    bio: profile.bio
                }
            });
            queryClient.setQueryData(['user'], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    displayName: profile.displayName
                }
            });
        }
    })

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto,
        updateProfile,
        updateFollowing,
        followings,
        loadingFollowings
    }
}