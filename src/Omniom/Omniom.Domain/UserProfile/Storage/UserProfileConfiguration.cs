using Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;

namespace Omniom.Domain.UserProfile.Storage;

internal class UserProfileConfiguration
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Guid UserId { get; set; }
    public List<MealConfigurationItem>? MealsConfiguration { get; set; }
    public NutritionTargetConfiguration? NutritionTarget { get; set; }
}