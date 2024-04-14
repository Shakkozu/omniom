namespace Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;

public record NutritionTargetConfiguration
{
    public decimal Calories { get; set; }
    public decimal ProteinsPercents { get; set; }
    public decimal CarbohydratesPercents { get; set; }
    public decimal FatsPercents { get; set; }
    public decimal ProteinsGrams { get; set; }
    public decimal CarbohydratesGrams { get; set; }
    public decimal FatsGrams { get; set; }

    public static NutritionTargetConfiguration Default => new NutritionTargetConfiguration
    {
        Calories = 2000,
        ProteinsPercents = 25,
        CarbohydratesPercents = 60,
        FatsPercents = 15,
        ProteinsGrams = 125,
        CarbohydratesGrams = 300,
        FatsGrams = 33
    };
}