using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.FindById;

namespace Omniom.Domain.NutritionDiary.AddProductToDiary;
public class AddProductToDiaryCommand
{
    public AddProductToDiaryCommand(Guid userId, Guid productId, Guid guid, int portionInGrams, MealType meal, DateTime date)
    {
        UserId = userId;
        ProductId = productId;
        Guid = guid;
        PortionInGrams = portionInGrams;
        Meal = meal;
        Date = date.ToUniversalTime().Date;
    }

    public Guid UserId { get; }
    public Guid ProductId { get; }
    public Guid Guid { get; }
    public int PortionInGrams { get; }
    public MealType Meal { get; }
    public DateTime Date { get; }
}

public class AddProductToDiaryCommandHandler
{
    private readonly NutritionDiaryDbContext _dbContext;
    private readonly FindProductByIdQueryHandler _findProductByIdQueryHandler;

    public AddProductToDiaryCommandHandler(NutritionDiaryDbContext dbContext, FindProductByIdQueryHandler findProductByIdQueryHandler)  
    {
        _dbContext = dbContext;
        _findProductByIdQueryHandler = findProductByIdQueryHandler;
    }

    public async Task HandleAsync(AddProductToDiaryCommand command, CancellationToken ct)
    {
        var productDetails = await _findProductByIdQueryHandler.HandleAsync(new FindByIdQuery(command.ProductId), ct);
        var portionSizeRatio = (decimal)command.PortionInGrams / 100;
        var diaryEntry = new DiaryEntry
        {
            UserId = command.UserId,
            ProductId = command.ProductId,
            Guid = command.Guid,
            Meal = command.Meal,
            DateTime = command.Date.ToUniversalTime().Date,
            PortionInGrams = command.PortionInGrams,
            ProductName = productDetails.Name,
            Calories = productDetails.KcalPer100G * portionSizeRatio,
            Fats = productDetails.FatPer100G * portionSizeRatio,
            Proteins = productDetails.ProteinsPer100G * portionSizeRatio,
            Carbohydrates = productDetails.CarbsPer100G * portionSizeRatio,
            SaturatedFats = productDetails.SaturatedFatPer100G.HasValue ? productDetails.SaturatedFatPer100G * portionSizeRatio : default,
            Sugars = productDetails.SugarsPer100G.HasValue ?  productDetails.SugarsPer100G * portionSizeRatio : default,
        };

        await _dbContext.DiaryEntries.AddAsync(diaryEntry, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
}
