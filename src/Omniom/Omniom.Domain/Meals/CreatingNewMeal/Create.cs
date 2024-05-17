using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Omniom.Domain.Meals.Storage;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;

namespace Omniom.Domain.Meals.CreatingNewMeal;
internal static class Route
{
    internal static IEndpointRouteBuilder MapCreateMeal(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/dishes", async (HttpContext context,
            [FromServices] MealsDbContext dbContext,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken cancellationToken,
            [FromBody] Meal meal) =>
        {
            if(meal == null)
            {
                context.Response.StatusCode = 400;
                return;
            }
            var errors = meal.GetValidationErros();
            if (errors.Any())
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(errors);
                return;
            }
            dbContext.Meals.Add(new UserMealDao(meal, userIdProvider.GetUserId()));
            await dbContext.SaveChangesAsync(cancellationToken);
            context.Response.StatusCode = 201;
        });

        return endpoints;
    }
}

