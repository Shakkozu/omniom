using FluentAssertions;
using Newtonsoft.Json;
using Omniom.Domain.Meals.GettingMeal;
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
        await _client.CreateMealAsync(meal);

        var userMeals = await _client.GetMeals();

        Assert.Multiple(() =>
        {
            var createdMeal = userMeals.Single();
            createdMeal.Name.Should().Be(meal.Name);
            createdMeal.Description.Should().Be(meal.Description);
            createdMeal.PortionSize.Should().Be(meal.Portions);
            //createdMeal.Ingredients.Should().BeEquivalentTo(meal.Ingredients);
            createdMeal.KcalPerPortion.Should().Be(meal.Ingredients.Sum(x => x.Kcal) / meal.Portions);
            createdMeal.ProteinsGramsPerPortion.Should().Be(meal.Ingredients.Sum(x => x.Proteins) / meal.Portions);
            createdMeal.CarbohydratesGramsPerPortion.Should().Be(meal.Ingredients.Sum(x => x.Carbohydrates) / meal.Portions);
            createdMeal.FatsGramsPerPortion.Should().Be(meal.Ingredients.Sum(x => x.Fats) / meal.Portions);
        });
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
