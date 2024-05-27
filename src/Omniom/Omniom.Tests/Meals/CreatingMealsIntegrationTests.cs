using FluentAssertions;
using Omniom.Domain.Catalogue.Meals.Storage;
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
            createdMeal.Portions.Should().Be(meal.Portions);
            createdMeal.PortionInGrams.Should().Be((int)(meal.Ingredients.Sum(i => i.PortionInGrams) / meal.Portions));
            createdMeal.Ingredients.Should().BeEquivalentTo(meal.Ingredients);
            createdMeal.KcalPer100G.Should().Be(meal.Ingredients.Sum(x => x.KcalPer100G));
            createdMeal.ProteinsPer100G.Should().Be(meal.Ingredients.Sum(x => x.ProteinsPer100G));
            createdMeal.CarbohydratesPer100G.Should().Be(meal.Ingredients.Sum(x => x.CarbohydratesPer100G));
            createdMeal.FatsPer100G.Should().Be(meal.Ingredients.Sum(x => x.FatsPer100G));
        });
    }

    private Meal AMeal()
    {
        var products = _omniomApp.ProductsTestsFixture.AProductsFromCatalogue().Result.ToList();
        var ingredients = products
            .OrderBy(x => Guid.NewGuid()) // Shuffle the products list
            .Take(1)
            .Select(p => new MealIngredient(p.Name,
                                            p.Guid,
                                            100,
                                            p.KcalPer100G,
                                            p.ProteinsPer100G,
                                            p.CarbohydratesPer100G,
                                            p.FatsPer100G))
            .ToList();
        return new Meal(Guid.NewGuid(), "Name", "Description", "Recipe", 1, ingredients);
    }
}
