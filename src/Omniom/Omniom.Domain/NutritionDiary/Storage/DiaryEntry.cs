using Omniom.Domain.ProductsCatalogue.SearchProducts;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Omniom.Domain.NutritionDiary.Storage;

public class DiaryEntry
{
    public int Id { get; set; }
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
    public decimal? Sugars { get; set; }
    public decimal? SaturatedFats { get; set; }
    public DateTime DateTime { get; set; }

    internal void ModifyPortion(int portionInGrams, ProductDetailsDescription productData)
    {
        var portionSizeRatio = portionInGrams / 100;
        PortionInGrams = portionInGrams;
        Calories = productData.KcalPer100G * portionSizeRatio;
        Fats = productData.FatPer100G * portionSizeRatio;
        Proteins = productData.ProteinsPer100G * portionSizeRatio;
        Carbohydrates = productData.CarbsPer100G * portionSizeRatio;
        SaturatedFats = productData.SaturatedFatPer100G.HasValue ? productData.SaturatedFatPer100G * portionSizeRatio : default;
        Sugars = productData.SugarsPer100G.HasValue ? productData.SugarsPer100G * portionSizeRatio : default;
        ProductName = productData.Name;
    }
}