using Omniom.Domain.Meals.Storage;
using System.Net.Http.Json;

namespace Omniom.Tests.DishConfiguration;
internal class MealsRestClient
{
    private HttpClient _httpClient;

    public MealsRestClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    internal async Task<HttpResponseMessage> CreateMealAsync(Meal meal)
    {
        return await _httpClient.PostAsJsonAsync<Meal>($"/api/dishes", meal);
    }

    internal async Task<IEnumerable<Meal>> GetMeals()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<Meal>>($"/api/dishes") ?? throw new InvalidDataException("should return meals and returned null");
    }
}
