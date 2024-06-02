using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;

namespace Omniom.Tests.Shared;

[SetUpFixture]
public abstract class BaseIntegrationTestsFixture
{
    protected static OmniomApp _omniomApp;
    protected static List<ProductCatalogItem> _productsSet;
    protected static IEnumerable<MealCatalogueItem> _mealsSet;

    [OneTimeSetUp]
    public async Task OneTimeSetup()
    {
        _omniomApp = OmniomApp.CreateInstance(false);
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await _omniomApp.ProductsTestsFixture.AProductsFromCatalogue()).ToList();
        await _omniomApp.MealsTestsFixture.SeedMealsCatalogue(10);

        var userId = await _omniomApp.AuthFixture.GetUserIdAsync();
        _mealsSet = await _omniomApp.MealsTestsFixture.GetUserMeals(userId);
    }
}
