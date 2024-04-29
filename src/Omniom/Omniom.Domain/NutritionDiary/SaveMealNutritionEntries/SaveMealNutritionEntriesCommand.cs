using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.FindById;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.NutritionDiary.AddNutritionEntries;
public record MealProductEntryDto(Guid ProductId, int PortionSize);
public record SaveMealNutritionEntriesRequest(IEnumerable<MealProductEntryDto> Products, string MealType, DateTime SelectedDay);
public record SaveMealNutritionEntriesCommand(
    IEnumerable<MealProductEntryDto> Products,
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

    public SaveMealNutritionEntriesCommandHandler(NutritionDiaryDbContext dbContext,
        FindProductByIdQueryHandler findProductByIdQueryHandler)
    {
        _dbContext = dbContext;
        _findProductByIdQueryHandler = findProductByIdQueryHandler;
    }

    public async Task HandleAsync(SaveMealNutritionEntriesCommand command, CancellationToken ct)
    {
        var products = await _findProductByIdQueryHandler.HandleAsync(new FindMultipleByIdQuery(command.Products.Select(p => p.ProductId)), ct);
        var previousEntries = _dbContext.DiaryEntries.Where(x => 
        x.UserId == command.UserId &&
        x.DateTime == command.SelectedDay.ToUniversalTime().Date
        && x.Meal == command.MealType);
        _dbContext.DiaryEntries.RemoveRange(previousEntries);

        var result = new List<DiaryEntry>();
        foreach(var entry in command.Products)
        {
            var productDetails = products.Single(p => p.Guid == entry.ProductId);
            var portion = entry.PortionSize;
            var portionSizeRatio = (decimal)portion / 100;
            result.Add( new DiaryEntry
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


        await _dbContext.DiaryEntries.AddRangeAsync(result, ct);
    }
}
