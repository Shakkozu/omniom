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
            Assert.That(created.SuggestedPortionSizeG, Is.EqualTo(productDto.SuggestedPortionSizeG));
            Assert.That(created.SugarsPer100G, Is.EqualTo(productDto.SugarsPer100G));
            Assert.That(created.SaturatedFatPer100G, Is.EqualTo(productDto.SaturatedFatPer100G));
            Assert.That(created.Code, Is.EqualTo(productDto.Code));
            Assert.That(created.SaltPer100G, Is.EqualTo(productDto.SaltPer100G));
            Assert.That(created.Brands, Is.EqualTo(productDto.Brands));
            Assert.That(created.CategoriesTags, Is.EqualTo(productDto.CategoriesTags));
        });
    }

    private ProductDetailsDescription AProductInfoBasedOn(CreateProductCommand command)
    {
        return new ProductDetailsDescription(
            command.Guid,
            command.Code,
            command.Name,
            command.KcalPer100G,
            command.FatPer100G,
            command.CarbsPer100G,
            command.ProteinsPer100G,
            command.ServingSizeInGrams.Value,
            command.QuantityInGrams,
            command.SugarPer100G,
            command.FiberPer100G,
            command.SaltPer100G,
            command.SaturaredFatPer100G,
            command.Brands,
            command.CategoriesTags
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
