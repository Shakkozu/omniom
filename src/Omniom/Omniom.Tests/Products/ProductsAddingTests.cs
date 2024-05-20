using Omniom.Domain.Catalogue.Products.AddProducts;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

[TestFixture]
public class ProductsAddingTests : BaseIntegrationTestsFixture
{
    private CreateProductCommandHandler CreateProductCommandHandler => _omniomApp.CreateProductCommandHandler;
    private SearchProductsQueryHandler SearchProductsQueryHandler => _omniomApp.SearchProductsQueryHandler;

    [Test]
    public async Task ShouldCreateAndReadProduct()
    {
        var command = ProductsTestsFixture.ACreateProductCommand();
        var productDto = ProductsTestsFixture.AProductInfoBasedOn(command);
        await CreateProductCommandHandler.HandleAsync(command, CancellationToken.None);
        var query = new SearchProductsQuery(command.Name);

        var created = (await SearchProductsQueryHandler.HandleAsync(query, CancellationToken.None)).Products.Single() as ProductCatalogItem;

        Assert.Multiple(() =>
        {
            Assert.That(created.Name, Is.EqualTo($"{productDto.Name} [{productDto.Brands}]"));
            Assert.That(created.KcalPer100G, Is.EqualTo(productDto.KcalPer100G));
            Assert.That(created.FatsPer100G, Is.EqualTo(productDto.FatPer100G));
            Assert.That(created.CarbohydratesPer100G, Is.EqualTo(productDto.CarbsPer100G));
            Assert.That(created.ProteinsPer100G, Is.EqualTo(productDto.ProteinsPer100G));
            Assert.That(created.PortionInGrams, Is.EqualTo(productDto.SuggestedPortionSizeG));
            Assert.That(created.Code, Is.EqualTo(productDto.Code));
            Assert.That(created.Brands, Is.EqualTo(productDto.Brands));
            Assert.That(created.CategoriesTags, Is.EqualTo(productDto.CategoriesTags));
        });
    }
}
