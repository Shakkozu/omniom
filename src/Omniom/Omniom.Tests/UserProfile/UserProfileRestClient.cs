using Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;
using System.Net.Http.Json;

namespace Omniom.Tests.UserProfile;

internal class UserProfileRestClient
{
    private HttpClient _httpClient;

    public UserProfileRestClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    internal async Task CustomizeAvailableMealsConfiguration(CustomizeAvailableMealsConfigurationRequest configuration)
    {
        await _httpClient.PostAsJsonAsync(Route.ModifyMealConfiguration, configuration);
    }

    internal async Task<IEnumerable<MealConfigurationItem>> GetAvailableMealsConfiguration()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<MealConfigurationItem>>(Domain.UserProfile.MealsConfiguration.GettingUserMealsConfiguration.Route.GetMealsConfiguration) ?? [];
    }

    internal async Task ModifyNutritionTargets(NutritionTargetConfiguration request)
    {
        await _httpClient.PostAsJsonAsync(NutritionTargetsRoutes.SetNutritionTargets, request);
    }

    internal async Task<NutritionTargetConfiguration> GetNutritionTargets()
    {
        return await _httpClient.GetFromJsonAsync<NutritionTargetConfiguration>(NutritionTargetsRoutes.GetNutritionTargets);
    }
}