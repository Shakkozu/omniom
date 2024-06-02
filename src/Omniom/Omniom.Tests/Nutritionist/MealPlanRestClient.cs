using Omniom.Domain.Nutritionist.MealPlans.FetchingMealPlan;
using Omniom.Domain.Nutritionist.MealPlans.SavingMealPlan;
using System.Net.Http.Json;

namespace Omniom.Tests.Nutritionist;

internal static class MealPlanRestClient
{
    internal static async Task CreateMealPlan(this HttpClient client, MealPlan mealPlan)
    {
        var response = await client.PostAsJsonAsync("/api/nutritionist/meal-plans", mealPlan);
        response.EnsureSuccessStatusCode();
    }

    internal static async Task<MealPlan> GetMealPlanDetails(this HttpClient client, Guid mealPlanGuid)
    {
        return await client.GetFromJsonAsync<MealPlan>($"/api/nutritionist/meal-plans/{mealPlanGuid}") ?? throw new ArgumentException("invalid result from GetMEalPlanDetails");
    }

    internal static async Task<IEnumerable<MealPlanListItem>> GetMealPlansList(this HttpClient client)
    {
        return await client.GetFromJsonAsync<IEnumerable<MealPlanListItem>>($"/api/nutritionist/meal-plans") ?? throw new ArgumentException("invalid result from GetMEalPlanDetails");
    }
}
