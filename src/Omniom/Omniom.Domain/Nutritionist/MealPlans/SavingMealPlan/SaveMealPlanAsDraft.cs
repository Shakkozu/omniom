using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Nutritionist.Storage;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;

public static class Route
{
    public static IEndpointRouteBuilder MapSaveMealPlanAsDraftEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/nutritionist/meal-plans", async (HttpContext context,
                       [FromServices] IFetchUserIdentifierFromContext userIdProvider,
                        [FromServices] ICommandHandler<SaveMealPlanAsDraft> handler,
                        [FromBody] MealPlan mealPlan,
                        CancellationToken ct) =>
        {
            var validationErrors = mealPlan.GetValidationErrors().ToList();
            if (validationErrors.Any())
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(validationErrors);
                return;
            }
            var command = new SaveMealPlanAsDraft(mealPlan, userIdProvider.GetUserId());
            await handler.HandleAsync(command, ct);
            context.Response.StatusCode = 201;
        });

        return endpoints;
    }
}

internal record SaveMealPlanAsDraft(MealPlan MealPlan, Guid UserId) : ICommand;

internal class TransactionalSaveMealPlanAsDraftHandler : ICommandHandler<SaveMealPlanAsDraft>
{
    private readonly NutritionistDbContext _dbContext;

    public TransactionalSaveMealPlanAsDraftHandler(NutritionistDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(SaveMealPlanAsDraft command, CancellationToken ct)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);
        try
        {
            await new SaveMealPlanAsDraftHandler(_dbContext).HandleAsync(command, ct);
            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }
}

internal class SaveMealPlanAsDraftHandler : ICommandHandler<SaveMealPlanAsDraft>
{
    private readonly NutritionistDbContext _dbContext;

    public SaveMealPlanAsDraftHandler(NutritionistDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(SaveMealPlanAsDraft command, CancellationToken ct)
    {
        var userMealPlan = new UserMealPlanDao(command.MealPlan, command.UserId, DateTime.UtcNow, DateTime.UtcNow, MealPlanStatus.Draft);
        var existingMealPlan = await _dbContext.MealPlans.FirstOrDefaultAsync(mp => mp.Guid == userMealPlan.Guid && mp.UserId == userMealPlan.UserId, ct);
        if (existingMealPlan != null)
        {
            _dbContext.MealPlans.Remove(existingMealPlan);
        }

        _dbContext.MealPlans.Add(userMealPlan);
        await _dbContext.SaveChangesAsync(ct);
    }
}

internal class UserMealPlanDao
{
    public UserMealPlanDao()
    { }

    public UserMealPlanDao(MealPlan mealPlan, Guid userId, DateTime createdAt, DateTime modifiedAt, MealPlanStatus status)
    {
        UserId = userId;
        CreatedAt = createdAt;
        ModifiedAt = modifiedAt;
        Guid = mealPlan.Guid;
        Name = mealPlan.Name;
        Status = status.ToString();
        DailyCaloriesTarget = mealPlan.DailyCalories;
        MealDayDetails = JsonConvert.SerializeObject(mealPlan.Days.OrderBy(x => x.DayNumber).ToList());
    }

    public MealPlan ToMealPlan()
    {
        return new MealPlan
        {
            Guid = Guid,
            Status = Status,
            DailyCalories = DailyCaloriesTarget,
            Days = JsonConvert.DeserializeObject<IEnumerable<MealPlanDay>>(MealDayDetails)?.OrderBy(x => x.DayNumber).ToList() ?? throw new ArgumentNullException("Meal day details is invalid"),
            Name = Name,
            CreatedAt = CreatedAt,
            ModifiedAt = ModifiedAt
        };
    }

    internal void Publish()
    {
        Status = MealPlanStatus.Active.ToString();
        ModifiedAt = DateTime.UtcNow;
    }

    public int Id { get; set; }
    public string Name { get; }
    public Guid UserId { get; }
    public Guid Guid { get; }
    public string Status { get; private set; }
    public int DailyCaloriesTarget { get; }

    public string MealDayDetails { get; }

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }
}

public class MealPlan
{
    public Guid Guid { get; set; }
    public string Status { get; set; }
    public string Name { get; set; }
    public int DailyCalories { get; set; }

    public List<MealPlanDay> Days { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }

    public IEnumerable<string> GetValidationErrors()
    {
        if (string.IsNullOrWhiteSpace(Name))
        {
            yield return "Name is required";
        }

        if (DailyCalories <= 0)
        {
            yield return "Daily calories must be greater than 0";
        }

        if (Days == null || Days.Count == 0)
        {
            yield return "At least one day must be provided";
        }

        foreach (var day in Days)
        {
            if (day.Meals == null || day.Meals.Count == 0)
            {
                yield return $"At least one meal must be provided for day {day.DayNumber}";
            }
        }
    }
}

public record MealPlanDay
{
    public int DayNumber { get; set; }
    public List<MealPlanMeal> Meals { get; set; }
}

public record MealPlanMeal
{
    public MealType MealType { get; set; }
    public List<MealPlanProduct> Products { get; set; }
}

public enum MealPlanStatus
{
    Archived,
    Draft,
    Active
}

public record MealPlanProduct(MealCatalogueItem Product, Guid Guid);