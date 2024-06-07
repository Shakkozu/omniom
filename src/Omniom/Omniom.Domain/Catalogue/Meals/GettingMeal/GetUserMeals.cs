using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Catalogue.Products.Storage;
using System.Collections.Generic;

namespace Omniom.Domain.Catalogue.Meals.GettingMeal;

public static class Route
{
    public static IEndpointRouteBuilder MapGetUserMeals(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapGet("/api/dishes", async (HttpContext context,
                        [FromServices] IQueryable<UserMealDao> userMeals,
                        IFetchUserIdentifierFromContext userIdProvider,
                        [FromQuery] string? search,
                        IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> userMealsQueryHandler,
                        CancellationToken cancellationToken) =>
        {
            var query = new GetUserMealsQuery(userIdProvider.GetUserId(), search);
            var meals = (await userMealsQueryHandler.HandleAsync(query, cancellationToken)).ToList();

            await context.Response.WriteAsJsonAsync(meals, cancellationToken);
        });

        return routeBuilder;
    }
}

public record GetUserMealsQuery
{
    public GetUserMealsQuery(Guid userId, string? search = null)
    {
        UserId = userId;
        Search = string.IsNullOrEmpty(search) ? null : search.Trim();
    }

    public Guid UserId { get; }
    public string? Search { get; }
}
internal class GetUserMealsQueryHandler : IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>>
{
    private readonly MealsDbContext _dbContext;

    public GetUserMealsQueryHandler(MealsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<MealCatalogueItem>> HandleAsync(GetUserMealsQuery query, CancellationToken ct)
    {
        var mealsQuery = _dbContext.Meals
            .AsNoTracking()
            .Where(m => m.UserId == query.UserId);

        if (!string.IsNullOrEmpty(query.Search))
            mealsQuery = mealsQuery.Where(m => m.Meal.Name.Contains(query.Search));

        return (await mealsQuery
            .Select(x => x.Meal)
            .ToListAsync(ct))
            .Select(x => new MealCatalogueItem(x))
            .ToList();
    }
}