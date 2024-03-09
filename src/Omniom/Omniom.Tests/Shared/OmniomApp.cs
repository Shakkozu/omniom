using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Omniom.WebAPI;
using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;

namespace Omniom.Tests.Shared;


internal class OmniomApp : WebApplicationFactory<Program>
{
    private IServiceScope _scope;
    private bool _reuseScope;
    private readonly Action<IServiceCollection> _customization;
    private OmniomApp(Action<IServiceCollection> customization, bool reuseScope = false)
    {
        _customization = customization;
        _reuseScope = reuseScope;
        _scope = base.Services.CreateAsyncScope();
    }

    public static OmniomApp CreateInstance(bool reuseScope = false)
    {
        var omniomApp = new OmniomApp(_ => { }, reuseScope);
        return omniomApp;
    }

    public static OmniomApp CreateInstance(Action<IServiceCollection> customization, bool reuseScope = false)
    {
        var omniomApp = new OmniomApp(customization, reuseScope);
        return omniomApp;
    }

    private IServiceScope RequestScope()
    {
        if (!_reuseScope)
        {
            _scope.Dispose();
            _scope = Services.CreateAsyncScope();
        }
        return _scope;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);
        builder.ConfigureAppConfiguration(configurationBuilder =>
        {
            configurationBuilder.AddInMemoryCollection();
        });
        builder.ConfigureServices(collection =>
        {
            collection.AddTransient<Fixtures>();
        });

        builder.UseSetting("ASPNETCORE_ENVIRONMENT", "Tests");
        builder.UseSetting("Environment", "Tests");
        builder.ConfigureServices(_customization);
    }

    public HttpClient CreateHttpClient()
    {
        return CreateClient();
    }

    internal CreateProductCommandHandler CreateProductCommandHandler => RequestScope().ServiceProvider.GetRequiredService<CreateProductCommandHandler>();
    internal SearchProductsQueryHandler SearchProductsQueryHandler => RequestScope().ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
    internal ImportProductsToCatalogue ProductCatalogueImportHandler => RequestScope().ServiceProvider.GetRequiredService<ImportProductsToCatalogue>();
}
