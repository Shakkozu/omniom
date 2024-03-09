using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.ProductsCatalogue.SeedDatabase;
using Omniom.Domain.ProductsCatalogue.Storage;

namespace Omniom.Domain.ProductsCatalogue;

public static class ProductsCatalogueConfig
{
    public static IServiceCollection AddProductsCatalogue(this IServiceCollection serviceCollection, IConfiguration configuration) => 
        serviceCollection
            .AddTransient<CreateProductCommandHandler>()
            .AddTransient<SearchProductsQueryHandler>()
            .AddTransient<ImportProductsToCatalogue>()
            .AddDbContext<ProductsCatalogueDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("ProductsDatabase"));
            });
}
