using Omniom.Domain.ProductsCatalogue.Storage;

namespace Omniom.Domain.ProductsCatalogue.AddProducts;

public record CreateProductCommand(Guid Guid,
    string Name,
    string AdditionalDescription,
    int? ServingSizeInGrams,
    int? QuantityInGrams,
    string? Code,
    string? Brands,
    string? Categories,
    string? CategoriesTags,
    decimal KcalPer100G,
    decimal ProteinsPer100G,
    decimal FatPer100G,
    decimal CarbsPer100G,
    decimal? SaturaredFatPer100G,
    decimal? SugarPer100G,
    decimal? FiberPer100G,
    decimal? SaltPer100G
    );

public class CreateProductCommandHandler
{
    private readonly ProductsCatalogueDbContext _dbContext;

    public CreateProductCommandHandler(ProductsCatalogueDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(CreateProductCommand command, CancellationToken ct)
    {
        var productData = new ProductData
        {
            Guid = command.Guid,
            Code = command.Code,
            ProductNamePl = command.Name,
            GenericNamePl = command.AdditionalDescription,
            QuantityG = command.QuantityInGrams,
            ServingSizeG = command.ServingSizeInGrams ?? 100,
            Brands = command.Brands,
            Categories = command.Categories,
            CategoriesTags = command.CategoriesTags,
            EnergyKcal = command.KcalPer100G,
            FatValueG = command.FatPer100G,
            ProteinsValueG = command.ProteinsPer100G,
            CarbohydratesValueG = command.CarbsPer100G,
            SaturatedFatValueG = command.SaturaredFatPer100G,
            SugarsValueG = command.SugarPer100G,
            FiberValueG = command.FiberPer100G,
            SaltValueG = command.SaltPer100G
        };

        _dbContext.Products.Add(productData);
        await _dbContext.SaveChangesAsync(ct);
    }
}


