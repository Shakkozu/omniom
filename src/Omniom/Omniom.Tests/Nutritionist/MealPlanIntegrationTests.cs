using FluentAssertions;
using Omniom.Domain.NutritionDiary;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Nutritionist;

[TestFixture]
public class MealPlanIntegrationTests : BaseIntegrationTestsFixture
{
    [Test]
    public async Task SeedData()
    {
        var mealPlanInitializer = new MealPlanInitializer(_mealsSet);
        var httpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.Admin);
        for (int i = 0; i < 1; i++)
        {
            var mealPlan = mealPlanInitializer.AMealPlan();
            await httpClient.CreateMealPlan(mealPlan);
        }
    }

    [Test]
    public async Task ShouldPublishMealPlan()
    {
        var initializer = new MealPlanInitializer(_mealsSet);
        var mealPlan = initializer.AMealPlan();
        var httpClient = await _omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User);
        await httpClient.CreateMealPlan(mealPlan);

        await httpClient.PublishMealPlan(mealPlan.Guid);

        var mealPlanDetails = await httpClient.GetMealPlanDetails(mealPlan.Guid);
        mealPlanDetails.Status.Should().Be(MealPlanStatus.Active.ToString());
    }

    [Test]
    public async Task ShouldCreateMealPlan()
    {
        var initializer = new MealPlanInitializer(_mealsSet);
        var mealPlan = initializer.AMealPlan();
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
}