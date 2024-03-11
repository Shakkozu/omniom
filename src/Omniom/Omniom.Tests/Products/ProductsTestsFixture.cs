﻿
using Bogus;
using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.ProductsCatalogue.SeedDatabase;
using Omniom.Tests.Shared;

namespace Omniom.Tests.Products;

internal class ProductsTestsFixture
{
    private OmniomApp _app = OmniomApp.CreateInstance();
    private ImportProductsToCatalogue Importer => _app.ProductCatalogueImportHandler;
    internal void SeedProductsCatalogue()
    {
        var importData = ProductsDataCsvToObjectsMapper.MapCsvContentToProductsImportDtos("Products\\products_data.csv");
        Importer.SeedDatabase(new ImportProductsToCatalogueCommand(importData));
    }

    internal static CreateProductCommand ACreateProductCommand()
    {
        var faker = new Faker();

        return new CreateProductCommand(
            Guid.NewGuid(),
            faker.Commerce.ProductName(),
            faker.Lorem.Sentence(),
            faker.Random.Int(1, 1000),
            faker.Random.Int(1, 1000),
            faker.Commerce.Ean13(),
            faker.Company.CompanyName(),
            string.Join(";", faker.Commerce.Categories(12)),
            string.Join(";", faker.Commerce.Categories(12)),
            Math.Round(faker.Random.Decimal(1, 1000), 3),
            Math.Round(faker.Random.Decimal(1, 100), 3),
            Math.Round(faker.Random.Decimal(1, 100), 3),
            Math.Round(faker.Random.Decimal(1, 100), 3),
            Math.Round(faker.Random.Decimal(0, 100), 3),
            Math.Round(faker.Random.Decimal(0, 100), 3),
            Math.Round(faker.Random.Decimal(0, 100), 3),
            Math.Round(faker.Random.Decimal(0, 100), 3)
        );
    }

    internal static ProductDetailsDescription AProductInfoBasedOn(CreateProductCommand command)
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
}
