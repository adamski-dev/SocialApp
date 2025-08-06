using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    //we will use the primary constructor to access AbbDbContext class
    public class ActivitiesController(AppDbContext context) : BaseApiController
    {
        // We want to return Http Response so we use ActionResult of type of List of Activity
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await context.Activities.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(string id)
        {
            var activity = await context.Activities.FindAsync(id);
            if (activity == null) return NotFound();
            return activity;
        }
    }
}