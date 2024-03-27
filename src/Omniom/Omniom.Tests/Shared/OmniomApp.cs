using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Omniom.WebAPI;
using Omniom.Domain.ProductsCatalogue.AddProducts;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.ProductsCatalogue.SeedDatabase;
using Omniom.Tests.Products;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.Auth.Login;
using Newtonsoft.Json.Linq;
using Omniom.Tests.Auth;

namespace Omniom.Tests.Shared;


internal class OmniomApp : WebApplicationFactory<Program>
{
    private IServiceScope _scope;
    private bool _reuseScope;
    private string _token;
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
            collection.AddTransient<ProductsTestsFixture>();
            collection.AddTransient<AuthFixture>();
        });

        builder.UseSetting("ASPNETCORE_ENVIRONMENT", "Automated_Tests");
        builder.UseSetting("Environment", "Automated_Tests");
        builder.ConfigureServices(_customization);
    }

    public HttpClient CreateHttpClient()
    {
        return CreateClient();
    }

    public async Task<HttpClient> CreateHttpClientWithAuthorizationAsync()
    {
        var client = CreateClient();
        if (!string.IsNullOrEmpty(_token))
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_token}");
            return client;
        }

        var authToken = await RequestScope().ServiceProvider.GetRequiredService<AuthFixture>().GetAuthenticationTokenForSuperUserAsync();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {authToken}");
        return client;
    }

    internal CreateProductCommandHandler CreateProductCommandHandler => RequestScope().ServiceProvider.GetRequiredService<CreateProductCommandHandler>();
    internal SearchProductsQueryHandler SearchProductsQueryHandler => RequestScope().ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
    internal ImportProductsToCatalogue ProductCatalogueImportHandler => RequestScope().ServiceProvider.GetRequiredService<ImportProductsToCatalogue>();
    internal ProductsTestsFixture ProductsTestsFixture  => RequestScope().ServiceProvider.GetRequiredService<ProductsTestsFixture>();
    internal AuthFixture AuthFixture => RequestScope().ServiceProvider.GetRequiredService<AuthFixture>();

    internal AddProductToDiaryCommandHandler AddProductToDiaryCommandHandler => RequestScope().ServiceProvider.GetRequiredService<AddProductToDiaryCommandHandler>();
    internal ModifyProductPortionCommandHandler ModifyProductPortionCommandHandler => RequestScope().ServiceProvider.GetRequiredService<ModifyProductPortionCommandHandler>();
    internal GetNutritionDayQueryHandler GetDiaryQueryHandler => RequestScope().ServiceProvider.GetRequiredService<GetNutritionDayQueryHandler>();
    internal GetShortSummaryForDaysQueryHandler GetShortSummaryForDaysQueryHandler => RequestScope().ServiceProvider.GetRequiredService<GetShortSummaryForDaysQueryHandler>();
}
