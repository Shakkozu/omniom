using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Omniom.Domain.Catalogue.Products.SearchProducts;
internal static class Route
{
    internal static IEndpointRouteBuilder MapSearchProductEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/products",
            async (
                [FromServices] SearchProductsQueryHandler searchQueryHandler,
                [FromQuery] string? search,
                [FromQuery] int? pageSize,
                [FromQuery] int? page,
                CancellationToken ct
                ) =>
            {
                var query = new SearchProductsQuery(search ?? "", pageSize ?? 40, page ?? 1);
                return await searchQueryHandler.HandleAsync(query, ct);
            }
        );

        return endpoints;
    }
}
