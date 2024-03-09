﻿using Microsoft.EntityFrameworkCore;
using Omniom.Domain.ProductsCatalogue.Storage;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.ProductsCatalogue.SearchProducts;

public record SearchProductsQuery(string Name, int PageSize = 40, int Page = 1);

public record ProductDetailsDescription(Guid Guid,
    string Code,
    string Name,
    decimal KcalPer100G,
    decimal FatPer100G,
    decimal CarbsPer100G,
    decimal ProteinsPer100G,
    int SuggestedPortionSizeG,
    int? QuantityG,
    decimal? SugarsPer100G,
    decimal? FiberPer100G,
    decimal? SaltPer100G,
    decimal? SaturatedFatPer100G,
    string? Brands,
    string? CategoriesTags
    );

public record SearchProductsResponse(IEnumerable<ProductDetailsDescription> Products, int Page, int PageSize, int TotalCount);
public class SearchProductsQueryHandler
{
    private readonly ProductsCatalogueDbContext _dbContext;

    public SearchProductsQueryHandler(ProductsCatalogueDbContext catalogueDbContext)
    {
        _dbContext = catalogueDbContext;
    }

    public async Task<SearchProductsResponse> HandleAsync(SearchProductsQuery query, CancellationToken ct)
    {
        var searchResults = _dbContext.Products
            .Where(p =>
                p.ProductNamePl.ToLower().Contains(query.Name.ToLower())
                || p.GenericNamePl.ToLower().Contains(query.Name.ToLower()));
        var products = await searchResults
            .GetPage(query.Page, query.PageSize)
            .Select(p => new ProductDetailsDescription(
                p.Guid,
                p.Code,
                p.ProductNamePl,
                p.EnergyKcal,
                p.FatValueG,
                p.CarbohydratesValueG,
                p.ProteinsValueG,
                p.ServingSizeG,
                p.QuantityG,
                p.SugarsValueG,
                p.FiberValueG,
                p.SaltValueG,
                p.SaturatedFatValueG,
                p.Brands,
                p.CategoriesTags
            ))
            .ToListAsync(ct);

        var totalCount = await searchResults.CountAsync(ct);

        var searchProductsResponse = new SearchProductsResponse(products, query.Page, query.PageSize, totalCount);
        return searchProductsResponse;
    }
}