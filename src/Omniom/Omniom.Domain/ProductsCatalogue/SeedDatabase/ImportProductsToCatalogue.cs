using Omniom.Domain.ProductsCatalogue.Storage;

namespace Omniom.Domain.ProductsCatalogue.SeedDatabase;

public record ImportProductsToCatalogueCommand(IEnumerable<ProductImportDto> InputData);
public class ImportProductsToCatalogue
{
    private readonly ProductsCatalogueDbContext _productsCatalogueDbContext;

    public ImportProductsToCatalogue(ProductsCatalogueDbContext productsCatalogueDbContext)
    {
        _productsCatalogueDbContext = productsCatalogueDbContext;
    }

    public void AddEntries(ImportProductsToCatalogueCommand command)
    {
        int batchSize = 100;
        int count = 0;
        List<ProductData> products = new List<ProductData>();

        foreach (var dto in command.InputData)
        {
            ProductData product = MapToProduct(dto);
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

    private ProductData MapToProduct(ProductImportDto dto)
    {
        var quantity = QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(dto.Quantity);
        var servingSize = QuantityCorrector.ConvertQuantitySizeTextToNumericValueSpecifiedInGrams(dto.ServingSize);
        return new ProductData
        {
            ProductNamePl = dto.ProductNamePl,
            GenericNamePl = dto.GenericNamePl,
            Brands = dto.Brands,
            CarbohydratesValueG = dto.CarbohydratesValue,
            Categories = dto.Categories,
            CategoriesTags = dto.CategoriesTags,
            Code = dto.Code,
            EnergyKcal = dto.EnergyKcalValue,
            FatValueG = dto.FatValue,
            FiberValueG = dto.FiberValue,
            Guid = Guid.NewGuid(),
            ProteinsValueG = dto.ProteinsValue,
            QuantityG = quantity.HasError ? null : quantity.Value,
            ServingSizeG = servingSize.HasError ? 100 : servingSize.Value,
            SaltValueG = dto.SaltValue,
            SaturatedFatValueG = dto.SaturatedFatValue,
            SugarsValueG = dto.SugarsValue
        };
    }

    private void SaveProducts(List<ProductData> products)
    {
        _productsCatalogueDbContext.Products.AddRange(products);
        _productsCatalogueDbContext.SaveChanges();
    }
}