using FluentAssertions;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
using Omniom.Tests.Shared;
using System.Net.Http.Json;

namespace Omniom.Tests.UserProfile;

[TestFixture]
public class ModifyMealsConfigurationIntergrationTests : BaseIntegrationTestsFixture
{
    public IEnumerable<MealConfigurationItem> AllMealsEnabledConfiguration => new List<MealConfigurationItem>
    {
        new MealConfigurationItem(MealType.Breakfast.ToString(), true),
        new MealConfigurationItem(MealType.SecondBreakfast.ToString(), true),
        new MealConfigurationItem(MealType.Snack.ToString(), true),
        new MealConfigurationItem(MealType.Dinner.ToString(), true),
        new MealConfigurationItem(MealType.Supper.ToString(), true),
    };

    [Test]
    public async Task ShouldModifyMealsConfiguration()
    {
        var restClient = new UserProfileRestClient(await _omniomApp.CreateHttpClientWithAuthorizationAsync());
        var result = await restClient.GetAvailableMealsConfiguration();
        result.Should().BeEquivalentTo(AllMealsEnabledConfiguration);
        var request = new CustomizeAvailableMealsConfigurationRequest
        {
            Configuration = new List<MealConfigurationItem>
            {
                new MealConfigurationItem(MealType.Breakfast.ToString(), false),
                new MealConfigurationItem(MealType.SecondBreakfast.ToString(), true),
                new MealConfigurationItem(MealType.Snack.ToString(), false),
                new MealConfigurationItem(MealType.Dinner.ToString(), true),
                new MealConfigurationItem(MealType.Supper.ToString(), true),
            }
        };

        await restClient.CustomizeAvailableMealsConfiguration(request);
        result = await restClient.GetAvailableMealsConfiguration();
        result.Should().BeEquivalentTo(request.Configuration);
    }
}
