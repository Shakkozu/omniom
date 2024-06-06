using Bogus;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;

namespace Omniom.Domain.NutritionDiary;

public class MealPlanInitializer
{
    private readonly IEnumerable<MealCatalogueItem> _mealsSet;

    public MealPlanInitializer(IEnumerable<MealCatalogueItem> mealsSet)
    {
        _mealsSet = mealsSet;
    }

    public MealPlan AMealPlan()
    {
        var faker = new Faker("pl");
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
        // generate function which will return a random number from a range <1500, 3500> with step 100
        var mealPlan = new MealPlan
        {
            Name = "Plan" + faker.Name.JobType(),
            DailyCalories = faker.Random.Number(1500, 3500),
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
                    MealType = MealType.Snack,
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