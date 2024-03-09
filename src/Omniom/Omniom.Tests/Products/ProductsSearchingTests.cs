using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

public class ProductsSearchingTests
{

    private OmniomApp _app = default!;
    private SearchProductsQueryHandler SearchProductsQueryHandler => _app.SearchProductsQueryHandler;
    private ProductsTestsFixture ProductsCatalogueFixture => _app.ProductsTestsFixture;

    [OneTimeSetUp]
    public void SetUp()
    {
        _app = OmniomApp.CreateInstance();
        ProductsCatalogueFixture.SeedProductsCatalogue();
    }

    [Test]
    public async Task ShouldSearchProductsByName_ReturnProductsWhichMatchesNameOrGenericName()
    {
        var query = new SearchProductsQuery("Tortil");

        var result = await SearchProductsQueryHandler.HandleAsync(query, CancellationToken.None);

        Assert.That(result.Count(), Is.EqualTo(6));
    }

    [Test]
    public async Task ShouldPaginateProductsCorrectly()
    {
        Assert.Fail();
    }


    [Test]
    public async Task ShouldSeedProductsWithSampleData()
    {
        Assert.Fail();
    }
}
