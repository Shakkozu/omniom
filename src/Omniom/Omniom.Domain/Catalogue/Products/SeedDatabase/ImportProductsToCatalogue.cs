using Omniom.Domain.Catalogue.Products.Storage;

namespace Omniom.Domain.Catalogue.Products.SeedDatabase;

public record ImportProductsToCatalogueCommand(IEnumerable<ProductImportDto> InputData);
public class ImportProductsToCatalogue
{
    private readonly ProductsCatalogueDbContext _productsCatalogueDbContext;

    public ImportProductsToCatalogue(ProductsCatalogueDbContext productsCatalogueDbContext)
    {
        _productsCatalogueDbContext = productsCatalogueDbContext;
    }

    public void SeedDatabase(ImportProductsToCatalogueCommand command)
    {
        if (_productsCatalogueDbContext.Products.Any())
            return;

        int batchSize = 100;
        int count = 0;
        List<ProductData> products = new List<ProductData>();

        foreach (var dto in command.InputData)
        {
            ProductData product = dto.MapToProduct();
            if (product.EnergyKcal == 0)
                continue;

            products.Add(product);
            count++;

            if (count % batchSize == 0)
            {
                SaveProducts(products);
                products.Clear();
            }
        }

        if (products.Any())
        {
            SaveProducts(products);
        }
    }

    private void SaveProducts(List<ProductData> products)
    {
        _productsCatalogueDbContext.Products.AddRange(products);
        _productsCatalogueDbContext.SaveChanges();
    }
}