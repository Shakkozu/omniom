using Microsoft.EntityFrameworkCore;
using Omniom.Domain.ProductsCatalogue.Storage;

namespace Omniom.Domain.ProductsCatalogue.SearchProducts;

public record SearchProductsQuery(string Name);

public record ProductShortDescription(Guid Guid,
    string Name,
    decimal KcalPer100G,
    decimal FatPer100G,
    decimal CarbsPer100G,
    decimal ProteinsPer100G,
    int SuggestedPortionSize
    );

public class SearchProductsQueryHandler
{
    private readonly ProductsCatalogueDbContext _dbContext;

    public SearchProductsQueryHandler(ProductsCatalogueDbContext catalogueDbContext)
    {
        _dbContext = catalogueDbContext;
    }

    public async Task<IEnumerable<ProductShortDescription>> HandleAsync(SearchProductsQuery query, CancellationToken ct)
    {
        return await _dbContext.Products
            .Where(p => 
                p.ProductNamePl.ToLower().Contains(query.Name.ToLower())
                || p.GenericNamePl.ToLower().Contains(query.Name.ToLower())
                )
            .Select(p => new ProductShortDescription(p.Guid, p.ProductNamePl, p.EnergyKcal, p.FatValueG, p.CarbohydratesValueG, p.ProteinsValueG, p.ServingSizeG))
            .ToListAsync(ct);
    }
}