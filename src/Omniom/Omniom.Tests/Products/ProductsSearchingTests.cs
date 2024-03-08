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
    public async Task ShouldCreateAndReadProduct()
    {
        var command = ProductsTestsFixture.ACreateProductCommand();
        var productDto = AProductInfoBasedOn(command);
        await CreateProductCommandHandler.HandleAsync(command, CancellationToken.None);
        var query = new SearchProductsQuery(command.Name);

        var created = (await SearchProductsQueryHandler.HandleAsync(query, CancellationToken.None)).Single();

        Assert.Multiple(() =>
        {
            Assert.That(created.Name, Is.EqualTo(productDto.Name));
            Assert.That(created.KcalPer100G, Is.EqualTo(productDto.KcalPer100G));
            Assert.That(created.FatPer100G, Is.EqualTo(productDto.FatPer100G));
            Assert.That(created.CarbsPer100G, Is.EqualTo(productDto.CarbsPer100G));
            Assert.That(created.ProteinsPer100G, Is.EqualTo(productDto.ProteinsPer100G));
            Assert.That(created.SuggestedPortionSize, Is.EqualTo(productDto.SuggestedPortionSize));
        });
    }

    private ProductShortDescription AProductInfoBasedOn(CreateProductCommand command)
    {
        return new ProductShortDescription(
            command.Guid,
            command.Name,
            command.KcalPer100G,
            command.FatPer100G,
            command.CarbsPer100G,
            command.ProteinsPer100G,
            command.ServingSizeInGrams.Value
            );
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
