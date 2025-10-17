using System;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.VisualBasic;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Result<Activity>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Activity>>
    {
        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);
            return activity == null ? Result<Activity>.Failure("Activity not Found", 404) 
                                    : Result<Activity>.Success(activity);
        }
    }
}
