using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Meals.Storage;

namespace Omniom.Domain.Meals.GettingMeal;

public static class Route
{
    public static IEndpointRouteBuilder MapGetUserMeals(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapGet("/api/dishes", async (HttpContext context,
                        [FromServices] IQueryable<UserMealDao> userMeals,
                        IFetchUserIdentifierFromContext userIdProvider,
                        CancellationToken cancellationToken) =>
        {
            var meals = await userMeals
                .Where(m => m.UserId == userIdProvider.GetUserId())
                .Select(x => x.Meal)
                .ToListAsync(cancellationToken);

            await context.Response.WriteAsJsonAsync(meals, cancellationToken);
        });

        return routeBuilder;
    }
}