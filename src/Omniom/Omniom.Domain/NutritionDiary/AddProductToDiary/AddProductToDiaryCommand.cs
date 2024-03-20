using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.NutritionDiary.AddProductToDiary;
public class AddProductToDiaryCommand
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public Guid Guid { get; set; }
    public int PortionInGrams { get; set; }
    public MealType Meal { get; set; }
    public DateTime Date { get; set; }

}

public class AddProductToDiaryCommandHandler
{
    public async Task HandleAsync(AddProductToDiaryCommand command, CancellationToken ct)
    {
        // some logic
    }
}

public enum MealType
{
    Breakfast,
    SecondBreakfast,
    Dinner,
    Snack,
    Supper,
}