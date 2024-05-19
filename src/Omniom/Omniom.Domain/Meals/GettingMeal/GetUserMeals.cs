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
            var meals = (await userMeals
                .Where(m => m.UserId == userIdProvider.GetUserId())
                .Select(x => x.Meal)
                .ToListAsync(cancellationToken))
                .Select(x => new UserMealListViewModel(x));

            await context.Response.WriteAsJsonAsync(meals, cancellationToken);
        });

        return routeBuilder;
    }
}

public record UserMealListViewModel
{
    public Guid Guid { get; init; }
    public string Name { get; init; }
    public string? Description { get; init; }
    public List<MealIngredient> Ingredients { get; init; }
    public decimal PortionSize { get; init; }
    public decimal FatsGramsPerPortion { get; init; }
    public decimal ProteinsGramsPerPortion { get; init; }
    public decimal CarbohydratesGramsPerPortion { get; init; }
    public decimal KcalPerPortion { get; init; }

    public UserMealListViewModel(Meal meal)
    {
        Guid = meal.Guid;
        Name = meal.Name;
        Description = meal.Description;
        Ingredients = meal.Ingredients;
        PortionSize = meal.Portions;
        FatsGramsPerPortion = meal.Ingredients.Sum(x => x.Fats) / meal.Portions;
        ProteinsGramsPerPortion = meal.Ingredients.Sum(x => x.Proteins) / meal.Portions;
        CarbohydratesGramsPerPortion = meal.Ingredients.Sum(x => x.Carbohydrates) / meal.Portions;
        KcalPerPortion = meal.Ingredients.Sum(x => x.Kcal) / meal.Portions;
    }
}

