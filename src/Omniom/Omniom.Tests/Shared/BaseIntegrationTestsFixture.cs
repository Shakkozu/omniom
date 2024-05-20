using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;

namespace Omniom.Tests.Shared;

[SetUpFixture]
public abstract class BaseIntegrationTestsFixture
{
    protected static OmniomApp _omniomApp;
    protected static List<ProductCatalogItem> _productsSet;

    [OneTimeSetUp]
    public async Task OneTimeSetup()
    {
        _omniomApp = OmniomApp.CreateInstance(false);
        _omniomApp.ProductsTestsFixture.SeedProductsCatalogue();
        _productsSet = (await _omniomApp.ProductsTestsFixture.AProductsFromCatalogue()).ToList();
    }
}
