using Omniom.Domain.Catalogue.Meals.GettingMeal;
using Omniom.Domain.Catalogue.Products.FindById;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.NutritionDiary.AddNutritionEntries;
public record MealEntryDto(Guid Guid, int PortionSize, string Type);
public record SaveMealNutritionEntriesRequest(IEnumerable<MealEntryDto> Products, string MealType, DateTime SelectedDay);

public record MealEntry(Guid Guid, int PortionSize, CatalogueItemType CatalogueItemType);
public record SaveMealNutritionEntriesCommand(
    IEnumerable<MealEntry> MealEntries,
    MealType MealType,
    DateTime SelectedDay,
    Guid UserId
    )
{
}

public class TransactionalSaveMealNutritionEntriesCommandHandler : ICommandHandler<SaveMealNutritionEntriesCommand>
{
    private readonly ICommandHandler<SaveMealNutritionEntriesCommand> _inner;
    private readonly ITransactions _transactions;

    public TransactionalSaveMealNutritionEntriesCommandHandler(ICommandHandler<SaveMealNutritionEntriesCommand> inner,
        ITransactions transactions)
    {
        _inner = inner;
        _transactions = transactions;
    }

    public async Task HandleAsync(SaveMealNutritionEntriesCommand command, CancellationToken ct)
    {
        var transaction = await _transactions.BeginTransactionAsync();
        await _inner.HandleAsync(command, ct);
        await transaction.CommitAsync();

    }
}
public class SaveMealNutritionEntriesCommandHandler : ICommandHandler<SaveMealNutritionEntriesCommand>
{
    private readonly NutritionDiaryDbContext _dbContext;
    private readonly FindProductByIdQueryHandler _findProductByIdQueryHandler;
    private readonly IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> _getUserMealsQueryHandler;

    public SaveMealNutritionEntriesCommandHandler(NutritionDiaryDbContext dbContext,
        FindProductByIdQueryHandler findProductByIdQueryHandler,
        IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>> getUserMealsQueryHandler)
    {
        _getUserMealsQueryHandler = getUserMealsQueryHandler;
        _dbContext = dbContext;
        _findProductByIdQueryHandler = findProductByIdQueryHandler;
    }

    public async Task HandleAsync(SaveMealNutritionEntriesCommand command, CancellationToken ct)
    {
        var products = await _findProductByIdQueryHandler.HandleAsync(new FindMultipleByIdQuery(command.MealEntries.Select(p => p.Guid)), ct);
        var mealCatalogueItems = await _getUserMealsQueryHandler.HandleAsync(new GetUserMealsQuery(command.UserId), ct);
        var previousEntries = _dbContext.DiaryEntries
            .Where(x =>
                x.UserId == command.UserId &&
                x.DateTime == command.SelectedDay.ToUniversalTime().Date &&
                x.Meal == command.MealType);
        _dbContext.DiaryEntries.RemoveRange(previousEntries);

        var result = new List<DiaryEntry>();
        foreach (var entry in command.MealEntries)
        {
            var portion = entry.PortionSize;
            var portionSizeRatio = (decimal)portion / 100;
            if (entry.CatalogueItemType == CatalogueItemType.Product)
            {
                var productDetails = products.Single(p => p.Guid == entry.Guid);
                result.Add(new DiaryEntry
                {
                    UserId = command.UserId,
                    ProductId = productDetails.Guid,
                    Guid = Guid.NewGuid(),
                    Meal = command.MealType,
                    DateTime = command.SelectedDay.ToUniversalTime().Date,
                    PortionInGrams = portion,
                    ProductName = productDetails.Name,
                    Calories = productDetails.KcalPer100G * portionSizeRatio,
                    Fats = productDetails.FatPer100G * portionSizeRatio,
                    Proteins = productDetails.ProteinsPer100G * portionSizeRatio,
                    Carbohydrates = productDetails.CarbsPer100G * portionSizeRatio,
                    SaturatedFats = productDetails.SaturatedFatPer100G.HasValue ? productDetails.SaturatedFatPer100G * portionSizeRatio : default,
                    Sugars = productDetails.SugarsPer100G.HasValue ? productDetails.SugarsPer100G * portionSizeRatio : default,
                });
            }
            else
            {
                var meal = mealCatalogueItems.Single(m => m.Guid == entry.Guid);
                result.Add(new DiaryEntry
                {
                    UserId = command.UserId,
                    Guid = Guid.NewGuid(),
                    Meal = command.MealType,
                    UserMealId = meal.Guid,
                    UserMealName = meal.Name,
                    DateTime = command.SelectedDay.ToUniversalTime().Date,
                    PortionInGrams = portion,
                    Calories = meal.KcalPer100G * portionSizeRatio,
                    Fats = meal.FatsPer100G * portionSizeRatio,
                    Proteins = meal.ProteinsPer100G * portionSizeRatio,
                    Carbohydrates = meal.CarbohydratesPer100G * portionSizeRatio,
                    SaturatedFats = 0,
                    Sugars = 0,
                });
            }
        }

        await _dbContext.DiaryEntries.AddRangeAsync(result, ct);
    }
}
