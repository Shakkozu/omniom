using Microsoft.EntityFrameworkCore;
using Omniom.Domain.NutritionDiary.Storage;

namespace Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
public record GetShortDaysSummary(Guid UserId, DateTime StartDate, DateTime EndDate);

public record ShortSummary
{
    public DateTime NutritionDay { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalCarbohydrates { get; set; }
    public decimal TotalProteins { get; set; }
    public decimal TotalFats { get; set; }
}

public class GetShortSummaryForDaysQueryHandler
{
    private readonly NutritionDiaryDbContext _dbContext;

    public GetShortSummaryForDaysQueryHandler(NutritionDiaryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<ShortSummary>> HandleAsync(GetShortDaysSummary query, CancellationToken ct)
    {
        var startDate = query.StartDate;
        var endDate = query.EndDate;
        var entries = await _dbContext.DiaryEntries
            .Where(entry => entry.UserId == query.UserId
                && entry.DateTime >= startDate
                && entry.DateTime.Date <= endDate)
            .GroupBy(ShortSummary => ShortSummary.DateTime.Date)
            .Select(group => new ShortSummary
            {
                NutritionDay = group.Key,
                TotalCalories = group.Sum(entry => entry.Calories),
                TotalCarbohydrates = group.Sum(entry => entry.Carbohydrates),
                TotalProteins = group.Sum(entry => entry.Proteins),
                TotalFats = group.Sum(entry => entry.Fats)
            })
            .ToListAsync(ct);

        var result = new List<ShortSummary>();
        foreach (var day in EachDay(startDate, endDate))
        {
            var entry = entries.SingleOrDefault(entry => entry.NutritionDay.Date == day.Date);
            if (entry == null)
            {
                result.Add(new ShortSummary
                {
                    NutritionDay = day,
                    TotalCalories = 0,
                    TotalCarbohydrates = 0,
                    TotalProteins = 0,
                    TotalFats = 0
                });
            }
            else
            {
                result.Add(entry);
            }
        }

        return result.OrderByDescending(x => x.NutritionDay);
    }

    private IEnumerable<DateTime> EachDay(DateTime startDate, DateTime endDate)
    {
        for (var day = startDate.Date; day.Date <= endDate; day = day.AddDays(1))
        {
            yield return day;
        }
        
    }
}