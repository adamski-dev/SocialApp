import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
//import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityDashboard() {

  // const {isFetchingNextPage, fetchNextPage, hasNextPage} = useActivities(); -> this was for the button

  return (
    <Grid2 container spacing={3}>
        <Grid2 size={8}>
            <ActivityList />
            {/* 
              <Button
                onClick={() => fetchNextPage()}
                sx={{my: 2, float: 'right'}}
                variant="contained"
                disabled={!hasNextPage || isFetchingNextPage}
              >
                Load more
              </Button>
            */}
        </Grid2>
        <Grid2 
          size={4}
          sx={{
            position: 'sticky',
            top: 96,
            alignSelf: 'flex-start'
          }}
        >
            <ActivityFilters/>
        </Grid2>
    </Grid2>
  )
}