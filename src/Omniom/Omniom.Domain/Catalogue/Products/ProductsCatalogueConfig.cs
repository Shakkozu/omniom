using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Catalogue.Products.AddProducts;
using Omniom.Domain.Catalogue.Products.FindById;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Products.SeedDatabase;
using Omniom.Domain.Catalogue.Products.Storage;
using System.Reflection;

namespace Omniom.Domain.Catalogue.Products;

public static class ProductsCatalogueConfig
{
    public static IServiceCollection AddProductsCatalogue(this IServiceCollection serviceCollection, IConfiguration configuration) =>
        serviceCollection
            .AddTransient<CreateProductCommandHandler>()
            .AddTransient<SearchProductsQueryHandler>()
            .AddTransient<FindProductByIdQueryHandler>()
            .AddTransient<ImportProductsToCatalogue>()
            .AddDbContext<ProductsCatalogueDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("ProductsDatabase"));
            });

    public static IEndpointRouteBuilder MapProductsCatalogueEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapSearchProductEndpoint();

        return endpoints;
    }

    public static void InitializeProductsCatalogueDatabase(this WebApplication application)
    {
        using (var scope = application.Services.CreateScope())
        {
            var importService = scope.ServiceProvider.GetRequiredService<ImportProductsToCatalogue>();

            var csvFilePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "ProductsCatalogue", "SeedDatabase", "products_data.csv");
            var importData = ProductsDataCsvToObjectsMapper.MapCsvContentToProductsImportDtos(csvFilePath);
            importService.SeedDatabase(new ImportProductsToCatalogueCommand(importData));
        }
    }
}
