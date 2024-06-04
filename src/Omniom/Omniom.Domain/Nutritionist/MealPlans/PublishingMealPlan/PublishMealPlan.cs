using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Microsoft.AspNetCore.Mvc;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Nutritionist.MealPlans.PublishingMealPlan;

internal static class Route
{
    internal static IEndpointRouteBuilder MapPublishMealPlanEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/api/nutritionist/meal-plans/{mealPlanGuid}/publish", async (HttpContext context,
            [FromServices] ICommandHandler<PublishMealPlan> handler,
            IFetchUserIdentifierFromContext userIdProvider,
            [FromRoute] Guid mealPlanGuid,
            CancellationToken ct) =>
        {
            var command = new PublishMealPlan(mealPlanGuid, userIdProvider.GetUserId());
            await handler.HandleAsync(command, ct);
            context.Response.StatusCode = 200;
        });

        return endpoints;
    }
}

internal record PublishMealPlan(Guid MealPlanGuid, Guid UserGuid);

internal class PublishMealPlanHandler : ICommandHandler<PublishMealPlan>
{
    private readonly NutritionistDbContext _dbContext;

    public PublishMealPlanHandler(NutritionistDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(PublishMealPlan command, CancellationToken ct)
    {
        var mealPlan = await _dbContext.MealPlans.SingleAsync(mealPlan => mealPlan.Guid == command.MealPlanGuid && mealPlan.UserId == command.UserGuid, ct);
        mealPlan.Publish();
        await _dbContext.SaveChangesAsync(ct);
    }
}
