using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;

namespace Omniom.Tests.UserProfile;

public class ModifyMealTests
{
    [Test]
    public void ShouldNotCreateModificationCommandWhenMealTypeIsMissing()
    {
        var config = new List<MealConfigurationItem> {
            new MealConfigurationItem(MealType.SecondBreakfast.ToString(), true),
            new MealConfigurationItem(MealType.Snack.ToString(), true),
            new MealConfigurationItem(MealType.Dinner.ToString(), true),
            new MealConfigurationItem(MealType.Supper.ToString(), true),
        };

        Assert.Throws<ArgumentException>(() => CustomizeAvailableMealsConfigurationCommand.Create(Guid.NewGuid(), config));

    }
    [Test]
    public void ShouldNotCreateModificationCommandWhenMealTypeIsInvalid()
    {
        var config = new List<MealConfigurationItem> {
            new MealConfigurationItem("InvalidMeal", false),
        };

        Assert.Throws<ArgumentException>(() => CustomizeAvailableMealsConfigurationCommand.Create(Guid.NewGuid(), config));
    }

    [Test]
    public void ShouldCreateValidModificationCommand()
    {
        var config = new List<MealConfigurationItem> {
            new MealConfigurationItem(MealType.Breakfast.ToString(), false),
            new MealConfigurationItem(MealType.SecondBreakfast.ToString(), true),
            new MealConfigurationItem(MealType.Snack.ToString(), true),
            new MealConfigurationItem(MealType.Dinner.ToString(), true),
            new MealConfigurationItem(MealType.Supper.ToString(), true),
        };

        Assert.NotNull(config);
    }

}
