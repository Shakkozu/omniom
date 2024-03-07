
using Bogus;
using Omniom.Domain.ProductsCatalogue.AddProducts;

namespace Omniom.Tests.Products;

internal static class ProductsTestsFixture
{
    internal static CreateProductCommand ACreateProductCommand()
    {
        var faker = new Faker();

        return new CreateProductCommand(
            Guid.NewGuid(),
            faker.Commerce.ProductName(),
            faker.Lorem.Sentence(),
            faker.Random.Int(1, 1000),
            faker.Random.Int(1, 1000),
            faker.Random.String(6),
            faker.Company.CompanyName(),
            string.Join(";", faker.Commerce.Categories(12)),
            string.Join(";", faker.Commerce.Categories(12)),
            faker.Random.Decimal(1, 1000),
            faker.Random.Decimal(1, 100),
            faker.Random.Decimal(1, 100),
            faker.Random.Decimal(1, 100),
            faker.Random.Decimal(0, 100),
            faker.Random.Decimal(0, 100),
            faker.Random.Decimal(0, 100),
            faker.Random.Decimal(0, 100)
        );
    }
}
