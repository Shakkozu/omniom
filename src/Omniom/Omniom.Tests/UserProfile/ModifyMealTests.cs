using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;

namespace Omniom.Tests.UserProfile;

public class ModifyMealTests
{
    [Test]
    public void ShouldNotCreateModificationCommandWhenMealTypeIsMissing()
    {
        var config = new List<MealConfigurationItem> {
            new MealConfigurationItem(MealType.SecondBreakfast, true),
            new MealConfigurationItem(MealType.Snack, true),
            new MealConfigurationItem(MealType.Dinner, true),
            new MealConfigurationItem(MealType.Supper, true),
        };

        Assert.Throws<ArgumentException>(() => CustomizeAvailableMealsConfigurationCommand.Create(Guid.NewGuid(), config));
    }

    [Test]
    public void ShouldCreateValidModificationCommand()
    {
        var config = new List<MealConfigurationItem> {
            new MealConfigurationItem(MealType.Breakfast, false),
            new MealConfigurationItem(MealType.SecondBreakfast, true),
            new MealConfigurationItem(MealType.Snack, true),
            new MealConfigurationItem(MealType.Dinner, true),
            new MealConfigurationItem(MealType.Supper, true),
        };

        Assert.NotNull(config);
    }

}
