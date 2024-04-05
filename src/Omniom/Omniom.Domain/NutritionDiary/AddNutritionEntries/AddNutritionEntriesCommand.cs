using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.FindById;
using Omniom.Domain.Shared.BuildingBlocks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.NutritionDiary.AddNutritionEntries;
public record MealProductEntryDto(Guid ProductId, int PortionSize);
public record AddNutritionEntriesRequest(IEnumerable<MealProductEntryDto> Products, string MealType, DateTime SelectedDay);
public record AddNutritionEntriesCommand(
    IEnumerable<MealProductEntryDto> Products,
    MealType MealType,
    DateTime SelectedDay,
    Guid UserId
    )
{
}

public class AddNutritionEntriesCommandHandler : ICommandHandler<AddNutritionEntriesCommand>
{
    private readonly NutritionDiaryDbContext _dbContext;
    private readonly FindProductByIdQueryHandler _findProductByIdQueryHandler;

    public AddNutritionEntriesCommandHandler(NutritionDiaryDbContext dbContext,
        FindProductByIdQueryHandler findProductByIdQueryHandler)
    {
        _dbContext = dbContext;
        _findProductByIdQueryHandler = findProductByIdQueryHandler;
    }

    public async Task HandleAsync(AddNutritionEntriesCommand command, CancellationToken ct)
    {
        var products = await _findProductByIdQueryHandler.HandleAsync(new FindMultipleByIdQuery(command.Products.Select(p => p.ProductId)), ct);

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
        await _dbContext.SaveChangesAsync(ct);        
    }
}
