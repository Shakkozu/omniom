using FluentAssertions;
using Newtonsoft.Json;
using Omniom.Domain.Meals.Storage;
using Omniom.Tests.Shared;

namespace Omniom.Tests.DishConfiguration;

[TestFixture]
internal class CreatingMealsIntegrationTests : BaseIntegrationTestsFixture
{
    private MealsRestClient _client;

    [SetUp]
    public void SetUp()
    {
        _client = new MealsRestClient(_omniomApp.CreateHttpClientWithAuthorizationAsync(OmniomApp.UserType.User).Result);
    }

    [Test]
    public async Task ShouldDefineNewMeal()
    {
        var meal = AMeal();
        var asJson = JsonConvert.SerializeObject(meal, Formatting.None);
        await _client.CreateMealAsync(meal);

        var userMeals = await _client.GetMeals();

        var responseJson = JsonConvert.SerializeObject(userMeals.FirstOrDefault(), Formatting.None);
        responseJson.Should().Be(asJson);
    }

    private Meal AMeal()
    {
        var products = _omniomApp.ProductsTestsFixture.AProductsFromCatalogue().Result.ToList();
        var ingredients = products
            .OrderBy(x => Guid.NewGuid()) // Shuffle the products list
            .Take(1)
            .Select(p => new MealIngredient(p.Name, p.Guid, 100, p.KcalPer100G, p.ProteinsPer100G, p.CarbsPer100G, p.FatPer100G))
            .ToList();
        return new Meal(Guid.NewGuid(), "Name", "Description", "Recipe", 1, ingredients);
    }
}
