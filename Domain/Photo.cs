
using System;
using System.Text.Json.Serialization;

namespace Domain;
public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; }

    // nav properties - with the below properties when we run migration now, the Photos behaviour will be now to delete
    // the photos of the User when we delete a User 
    public required string UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; } = null!;
}