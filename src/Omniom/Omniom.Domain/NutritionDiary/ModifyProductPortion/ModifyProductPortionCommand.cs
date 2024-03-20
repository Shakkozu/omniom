using Omniom.Domain.NutritionDiary.AddProductToDiary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.NutritionDiary.ModifyProductPortion;
public class ModifyProductPortionCommand
{
    public Guid UserId { get; set; }
    public Guid Guid { get; set; }
    public int PortionInGrams { get; set; }
    public DateTime Date { get; set; }
}
public class ModifyProductPortionCommandHandler
{
    public async Task HandleAsync(ModifyProductPortionCommand modifyFirstProductInDiaryCommand, CancellationToken none)
    {
        throw new NotImplementedException();
    }
}


public class GetDiaryQuery
{
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
}
public class GetDiaryQueryHandler
{
    public async Task<IEnumerable<DiaryEntryDto>> HandleAsync(GetDiaryQuery getDiaryQuery, CancellationToken none)
    {
        throw new NotImplementedException();
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
    public string ProductName { get; set; }
    public int PortionInGrams { get; set; }
    public MealType Meal { get; set; }
    public decimal Calories { get; set; }
    public decimal Proteins { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fats { get; set; }
}