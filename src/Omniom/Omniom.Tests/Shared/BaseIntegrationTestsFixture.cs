using Omniom.Domain.ProductsCatalogue.SearchProducts;

namespace Omniom.Tests.Shared;

[SetUpFixture]
public abstract class BaseIntegrationTestsFixture
{
    protected static OmniomApp _omniomApp;
    protected static List<ProductDetailsDescription> _productsSet;

    [OneTimeSetUp]
    public async Task OneTimeSetup()
    {
        _omniomApp = OmniomApp.CreateInstance(true);
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await _omniomApp.ProductsTestsFixture.AProductsFromCatalogue()).ToList();
    }
}
