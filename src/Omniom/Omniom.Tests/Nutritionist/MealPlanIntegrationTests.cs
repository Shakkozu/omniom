using FluentAssertions;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Nutritionist;

[TestFixture]
public class MealPlanIntegrationTests : BaseIntegrationTestsFixture
{
    [Test]
    public async Task ShouldCreateMealPlan()
    {
        var mealPlan = AMealPlan();
        var httpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        await httpClient.CreateMealPlan(mealPlan);

        var userMealPlan = await httpClient.GetMealPlanDetails(mealPlan.Guid);
        var userMealPlans = await httpClient.GetMealPlansList();

        userMealPlan.Should().BeEquivalentTo(mealPlan, options => options
            .Excluding(p => p.CreatedAt)
            .Excluding(p => p.ModifiedAt));
        var planFromList = userMealPlans.Single();
        planFromList.Name.Should().Be(mealPlan.Name);
        planFromList.DailyCalories.Should().Be(mealPlan.DailyCalories);
    }

    private MealPlan AMealPlan()
    {
        var days = new List<MealPlanDay>
        {
            AMealDayPlan(1),
            AMealDayPlan(2),
            AMealDayPlan(3),
            AMealDayPlan(4),
            AMealDayPlan(5),
            AMealDayPlan(6),
            AMealDayPlan(7),
        };
        var mealPlan = new MealPlan
        {
            Name = "Test Meal Plan",
            DailyCalories = 2000,
            Guid = Guid.NewGuid(),
            Status = MealPlanStatus.Draft.ToString(),
            Days = days,
            ModifiedAt = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        return mealPlan;
    }

    private MealPlanDay AMealDayPlan(int dayNumber)
    {
        var randomProductItem = _productsSet.OrderBy(x => Guid.NewGuid()).FirstOrDefault();
        var ingredientsCount = new Random().Next(1, 3);
        var ingredients = _mealsSet.OrderBy(x => Guid.NewGuid()).Take(ingredientsCount);
        var mealPlanProducts = ingredients.Select(ingredient => new MealPlanProduct(ingredient, Guid.NewGuid())).ToList();
        return new MealPlanDay
        {
            DayNumber = dayNumber,
            Meals = new List<MealPlanMeal>
            {
                new MealPlanMeal
                {
                    MealType = MealType.Breakfast,
                    Products = ARandomSetOfMealPlanProducts(2).ToList()
                },
                
                new MealPlanMeal
                {
                    MealType = MealType.SecondBreakfast,
                    Products = ARandomSetOfMealPlanProducts(2).ToList()
                },
                
                new MealPlanMeal
                {
                    MealType = MealType.Supper,
                    Products = ARandomSetOfMealPlanProducts(2).ToList()
                },
                
                new MealPlanMeal
                {
                    MealType = MealType.Dinner,
                    Products = ARandomSetOfMealPlanProducts(2).ToList()
                },
            }
        };

    }


    private IEnumerable<MealPlanProduct> ARandomSetOfMealPlanProducts(int count)
    {
        var products = _mealsSet.OrderBy(x => Guid.NewGuid()).Take(count);
        return products.Select(p => new MealPlanProduct(p, Guid.NewGuid()));
    }

}
