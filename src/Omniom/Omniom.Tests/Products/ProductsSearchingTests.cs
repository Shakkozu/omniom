using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

public class ProductsSearchingTests
{

    private OmniomApp _app = default!;
    private CreateProductCommandHandler CreateProductCommandHandler => _app.CreateProductCommandHandler;
    private SearchProductsQueryHandler SearchProductsQueryHandler => _app.SearchProductsQueryHandler;

    [SetUp]
    public void SetUp()
    {
        _app = OmniomApp.CreateInstance();
    }

    [Test]
    public void ShouldSearchProductsByName()
    {
        Assert.Fail();
    }

    [Test]
    public void ShouldPaginateProductsCorrectly()
    {
        Assert.Fail();
    }


    [Test]
    public void ShouldSeedProductsWithSampleData()
    {
        Assert.Fail();
    }
}
