using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
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
    }
}