using Microsoft.EntityFrameworkCore;
using Omniom.Domain.NutritionDiary.Storage;

namespace Omniom.Domain.NutritionDiary.GetDiary;
public class GetDiaryQuery
{
    public GetDiaryQuery(Guid userId, DateTime dateTime)
    {
        UserId = userId;
        DateTime = dateTime.ToUniversalTime();
    }
    public Guid UserId { get; }
    public DateTime DateTime { get; }
}
public class GetDiaryQueryHandler
{
    private readonly NutritionDiaryDbContext _nutritionDiaryDbContext;

    public GetDiaryQueryHandler(NutritionDiaryDbContext nutritionDiaryDbContext)
    {
        _nutritionDiaryDbContext = nutritionDiaryDbContext;
    }

    public async Task<IEnumerable<DiaryEntryDto>> HandleAsync(GetDiaryQuery getDiaryQuery, CancellationToken ct)
    {
        var entries = await _nutritionDiaryDbContext.DiaryEntries
            .Where(entries => entries.UserId == getDiaryQuery.UserId && entries.DateTime.Date == getDiaryQuery.DateTime.Date)
            .Select(entries => new DiaryEntryData
            {
                Guid = entries.Guid,
                ProductId = entries.ProductId,
                UserId = entries.UserId,
                ProductName = entries.ProductName,
                PortionInGrams = entries.PortionInGrams,
                Meal = entries.Meal,
                Calories = entries.Calories,
                Proteins = entries.Proteins,
                Carbohydrates = entries.Carbohydrates,
                Fats = entries.Fats
            }).ToListAsync(ct);

        return new List<DiaryEntryDto>
        {
            new DiaryEntryDto
            {
                Date = getDiaryQuery.DateTime,
                Entries = entries
            }
        };
    }
}


public class DiaryEntryDto
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
    public MealType Meal { get; set; }
    public decimal Calories { get; set; }
    public decimal Proteins { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fats { get; set; }
}