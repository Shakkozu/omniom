using FluentAssertions;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;
using Omniom.Tests.Shared;
using System.Net.Http.Json;

namespace Omniom.Tests.UserProfile;
public class ModifyMealsConfigurationIntergrationTests
{
    private OmniomApp _omniomApp;
    public IEnumerable<MealConfigurationItem> AllMealsEnabledConfiguration => new List<MealConfigurationItem>
    {
        new MealConfigurationItem(MealType.Breakfast, true),
        new MealConfigurationItem(MealType.SecondBreakfast, true),
        new MealConfigurationItem(MealType.Snack, true),
        new MealConfigurationItem(MealType.Dinner, true),
        new MealConfigurationItem(MealType.Supper, true),
    };

    [SetUp]
    public async Task Setup()
    {
        _omniomApp = OmniomApp.CreateInstance();
    }

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
                new MealConfigurationItem(MealType.Breakfast, false),
                new MealConfigurationItem(MealType.SecondBreakfast, true),
                new MealConfigurationItem(MealType.Snack, false),
                new MealConfigurationItem(MealType.Dinner, true),
                new MealConfigurationItem(MealType.Supper, true),
            }
        };

        await restClient.CustomizeAvailableMealsConfiguration(request);
        result = await restClient.GetAvailableMealsConfiguration();
        result.Should().BeEquivalentTo(request.Configuration);
    }
}

internal class UserProfileRestClient
{
    private HttpClient _httpClient;

    public UserProfileRestClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    internal async Task CustomizeAvailableMealsConfiguration(CustomizeAvailableMealsConfigurationRequest configuration)
    {
        await _httpClient.PostAsJsonAsync("api/user-profile/customize-meals-configuration", configuration);
    }

    internal async Task<IEnumerable<MealConfigurationItem>> GetAvailableMealsConfiguration()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<MealConfigurationItem>>("api/user-profile/meals-configuration") ?? [];
    }
}