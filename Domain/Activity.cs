using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Domain
{
    //Using data annotation to create an index of Property  'Date' for the cursor based pagination
    // index is automatically created within Activity class for the primary key Id, but if we want the additional index
    // then we have to specify the filed that we wish the database to create the index on. Migration is needed for this to take
    // effect.
    [Index(nameof (Date))]
    public class Activity
    {
        //This is entity type class to work with database, therefore the properties will be with public access as 
        // entity framework needs to access this class properties  

        //GUID stands for Global Unique Identifier. A GUID is a 128-bit integer (16 bytes) 
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Title { get; set; }
        public DateTime Date { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
        public bool IsCancelled { get; set; }

        //location properties
        public required string City { get; set; }
        public required string Venue { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        //navigation properties
        public ICollection<ActivityAttendee> Attendees { get; set; } = [];

        public ICollection<Comment> Comments { get; set; } = [];
    }
}