using Microsoft.EntityFrameworkCore;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.Extensions;

namespace Omniom.Domain.NutritionDiary.GetDiary;
public class GetNutritionDayQuery
{
    public GetNutritionDayQuery(Guid userId, DateTime dateTime)
    {
        UserId = userId;
        DateTime = dateTime;
    }
    public Guid UserId { get; }
    public DateTime DateTime { get; }
}
public class GetNutritionDayQueryHandler
{
    private readonly NutritionDiaryDbContext _nutritionDiaryDbContext;

    public GetNutritionDayQueryHandler(NutritionDiaryDbContext nutritionDiaryDbContext)
    {
        _nutritionDiaryDbContext = nutritionDiaryDbContext;
    }

    public async Task<IEnumerable<NutritionDayEntryDto>> HandleAsync(GetNutritionDayQuery getDiaryQuery, CancellationToken ct)
    {
        var endOfDay = getDiaryQuery.DateTime.GetEndOfDay();
        var startOfDay = getDiaryQuery.DateTime.Date;
        var entries = await _nutritionDiaryDbContext.DiaryEntries
            .Where(entries => 
                entries.UserId == getDiaryQuery.UserId && entries.DateTime >= startOfDay && entries.DateTime <= endOfDay)
            .Select(entries => new DiaryEntryData
            {
                Guid = entries.Guid,
                ProductId = entries.ProductId,
                UserId = entries.UserId,
                ProductName = entries.ProductName,
                PortionInGrams = entries.PortionInGrams,
                Meal = entries.Meal.ToString(),
                Calories = entries.Calories,
                Proteins = entries.Proteins,
                Carbohydrates = entries.Carbohydrates,
                Fats = entries.Fats
            })
            .ToListAsync(ct);

        return new List<NutritionDayEntryDto>
        {
            new NutritionDayEntryDto
            {
                Date = getDiaryQuery.DateTime.ToLocalTime().Date,
                Entries = entries
            }
        };
    }
}


public class NutritionDayEntryDto
{
    public IEnumerable<DiaryEntryData> Entries { get; set; }
    public DateTime Date { get; set; }
}

public record DiaryEntryData
{
    public Guid Guid { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public string ProductName { get; set; }
    public int PortionInGrams { get; set; }
    public string Meal { get; set; }
    public decimal Calories { get; set; }
    public decimal Proteins { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fats { get; set; }
}
