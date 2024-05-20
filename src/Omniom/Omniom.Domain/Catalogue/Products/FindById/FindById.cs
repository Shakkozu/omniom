using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Products.Storage;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Catalogue.Products.FindById;
public record FindByIdQuery(Guid Guid);
public record FindMultipleByIdQuery(IEnumerable<Guid> Guids);

public class FindProductByIdQueryHandler : IQueryHandler<FindByIdQuery, ProductDetailsDescription>, IQueryHandler<FindMultipleByIdQuery, IEnumerable<ProductDetailsDescription>>
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

    public async Task<IEnumerable<ProductDetailsDescription>> HandleAsync(FindMultipleByIdQuery query, CancellationToken ct)
    {
        return (await _dbContext.Products
            .Where(product => query.Guids.Contains(product.Guid))
            .ToListAsync(ct))
            .Select(product => new ProductDetailsDescription(
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
                product.CategoriesTags));
    }
}