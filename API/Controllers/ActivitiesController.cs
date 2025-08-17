using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //we will use the primary constructor to access AbbDbContext class
    public class ActivitiesController : BaseApiController
    {
        // We want to return Http Response so we use ActionResult of type of List of Activity
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new GetActivityList.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(string id)
        {
            return await Mediator.Send(new GetActivityDetails.Query {Id = id});
        }
    }
}