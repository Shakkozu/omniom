using Microsoft.EntityFrameworkCore;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.ProductsCatalogue.Storage;

namespace Omniom.Domain.ProductsCatalogue.FindById;
public record FindByIdQuery(Guid Guid);

public class FindProductByIdQueryHandler
{
    private readonly ProductsCatalogueDbContext _dbContext;

    public FindProductByIdQueryHandler(ProductsCatalogueDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductDetailsDescription> HandleAsync(FindByIdQuery query, CancellationToken ct)
    {
        var product = await _dbContext.Products.SingleAsync(product => product.Guid == query.Guid, ct);
        return new ProductDetailsDescription(
            product.Guid,
            product.Code,
            product.ProductNamePl,
            product.EnergyKcal,
            product.FatValueG,
            product.CarbohydratesValueG,
            product.ProteinsValueG,
            product.ServingSizeG,
            product.QuantityG,
            product.SugarsValueG,
            product.FiberValueG,
            product.SaltValueG,
            product.SaturatedFatValueG,
            product.Brands,
            product.CategoriesTags);
    }
}