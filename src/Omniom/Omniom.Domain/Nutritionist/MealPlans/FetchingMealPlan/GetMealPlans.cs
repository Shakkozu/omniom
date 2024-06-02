using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Nutritionist.MealPlans.FetchingMealPlan;
internal static class GetMealPlansRoute
{
    internal static IEndpointRouteBuilder MapGetMealPlansListEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapGet("/api/nutritionist/meal-plans",
                async (HttpContext context,
                       [FromServices] IQueryHandler<GetMealPlanListQuery, IEnumerable<MealPlanListItem>> mealPlanQueryHandler,
                       [FromServices] IFetchUserIdentifierFromContext userIdProvider,
                       CancellationToken cancellationToken) =>
                {
                    var mealPlans = await mealPlanQueryHandler.HandleAsync(
                        new GetMealPlanListQuery(userIdProvider.GetUserId()),
                        cancellationToken);

                    await context.Response.WriteAsJsonAsync(mealPlans, cancellationToken);
                });

        return routeBuilder;
    }
}
internal record GetMealPlanListQuery(Guid UserId);

public record MealPlanListItem(Guid Guid, string Name, int DailyCalories, DateTime ModifiedAt, string Status);

internal class GetMealPlansListQueryHandler : IQueryHandler<GetMealPlanListQuery, IEnumerable<MealPlanListItem>>
{
    private readonly NutritionistDbContext _nutritionistDbContext;

    public GetMealPlansListQueryHandler(NutritionistDbContext nutritionistDbContext)
    {
        _nutritionistDbContext = nutritionistDbContext;
    }

    public async Task<IEnumerable<MealPlanListItem>> HandleAsync(GetMealPlanListQuery query, CancellationToken ct)
    {
        return await _nutritionistDbContext.MealPlans
            .AsNoTracking()
            .Where(mp => mp.UserId == query.UserId)
            .Select(mp => new MealPlanListItem(mp.Guid, mp.Name, mp.DailyCaloriesTarget, mp.ModifiedAt, mp.Status))
            .ToListAsync(ct);
    }
}
