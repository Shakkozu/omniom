using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Omniom.Domain.Nutritionist.Storage;

namespace Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;

public static class Route
{
    public static IEndpointRouteBuilder MapSaveMealPlanAsDraft(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/nutritionist/meal-plans/draft", async (HttpContext context,
                       [FromServices] IFetchUserIdentifierFromContext userIdProvider,
                        [FromServices] ICommandHandler<SaveMealPlanAsDraft> handler,
                        [FromBody] MealPlan command,
                                                        CancellationToken ct) =>
        {
            await handler.HandleAsync(command, ct);
            context.Response.StatusCode = 201;
        });

        return endpoints;
    }

}

internal record SaveMealPlanAsDraft(MealPlan MealPlan, Guid UserId) : ICommand;
internal class SaveMealPlanAsDraftHandler : ICommandHandler<SaveMealPlanAsDraft>
{
    private readonly NutritionistDbContext _dbContext;

    public SaveMealPlanAsDraftHandler(NutritionistDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(SaveMealPlanAsDraft command, CancellationToken ct)
    {
        var mealPlan = new UserMealPlanDao(command.MealPlan, command.UserId);
        _dbContext.MealPlans.Add(mealPlan);
        await _dbContext.SaveChangesAsync(ct);
    }
}

internal class UserMealPlanDao
{
    private MealPlan _mealPlan;
    private Guid _userId;

    public UserMealPlanDao(MealPlan mealPlan, Guid userId)
    {
        _mealPlan = mealPlan;
        _userId = userId;
    }
}

public class MealPlan
{
    public Guid Guid { get; set; }
    public string Status { get; set; }
    public string Name { get; set; }
    public int DailyCalories { get; set; }

    public IEnumerable<MealPlanDay> Days { get; set; }
}

public record MealPlanDay
{
    public int DayNumber { get; set; }
    public IEnumerable<MealPlan> Meals { get; set; }
}

public record MealPlanMeal
{
    public MealType MealType { get; set; }
    public IEnumerable<MealPlanProduct> Products { get; set; }
}

public record MealPlanProduct(MealCatalogueItem MealCatalogueItem, Guid Guid);