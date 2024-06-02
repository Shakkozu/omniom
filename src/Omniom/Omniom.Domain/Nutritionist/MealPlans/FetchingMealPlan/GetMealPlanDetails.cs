using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;

namespace Omniom.Domain.Nutritionist.MealPlans.FetchingMealPlan;
internal static class Route
{
    internal static IEndpointRouteBuilder MapGetMealPlanDetailsEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapGet("/api/nutritionist/meal-plans/{mealPlanGuid}",
                async (HttpContext context,
                       [FromServices] IQueryHandler<GetMealPlanDetails, MealPlan> mealPlanQueryHandler,
                       [FromServices] IFetchUserIdentifierFromContext userIdProvider,
                       [FromRoute] Guid mealPlanGuid,
                       CancellationToken cancellationToken) =>
        {
            var query = new GetMealPlanDetails(userIdProvider.GetUserId(), mealPlanGuid);
            var mealPlan = await mealPlanQueryHandler.HandleAsync(query, cancellationToken);

            await context.Response.WriteAsJsonAsync(mealPlan, cancellationToken);
        });

        return routeBuilder;
    }
}
internal record GetMealPlanDetails(Guid UserId, Guid Guid);

internal class GetMealPlanDetailsHandler : IQueryHandler<GetMealPlanDetails, MealPlan>
{
    private readonly NutritionistDbContext _nutritionistDbContext;

    public GetMealPlanDetailsHandler(NutritionistDbContext nutritionistDbContext)
    {
        _nutritionistDbContext = nutritionistDbContext;
    }
    public async Task<MealPlan> HandleAsync(GetMealPlanDetails query, CancellationToken ct)
    {
        var dao = await _nutritionistDbContext.MealPlans.AsNoTracking().SingleAsync(mp => mp.Guid == query.Guid && mp.UserId == query.UserId);
        return dao.ToMealPlan();
    }
}
