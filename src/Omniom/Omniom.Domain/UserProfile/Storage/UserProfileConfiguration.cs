using Omniom.Domain.UserProfile.CustomizingAvailableMeals;

namespace Omniom.Domain.UserProfile.Storage;

internal class UserProfileConfiguration
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Guid UserId { get; set; }
    public List<MealConfigurationItem> MealsConfiguration { get; set; }
}