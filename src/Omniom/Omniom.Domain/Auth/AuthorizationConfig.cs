using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Auth.Login;
using Omniom.Domain.Auth.RegisterUser;
using Omniom.Domain.Auth.Storage;

namespace Omniom.Domain.Auth;

public static class AuthorizationConfig
{
    public static IServiceCollection AddAuthorizationModule(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        serviceCollection.AddAuthorization();
        serviceCollection.AddTransient<RegisterUserCommandHandler>();
        serviceCollection.AddTransient<LoginUserCommandHandler>();
        serviceCollection.AddDbContext<AuthorizationDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
        serviceCollection.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<AuthorizationDbContext>();
        return serviceCollection;
    }

    public static IEndpointRouteBuilder MapAuthenticationModuleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapLoginEndpoint();
        endpoints.MapRegisterUserEndpoint();

        endpoints.MapGet("weather", () =>
        {
            return "sunny";
        }).RequireAuthorization().WithGroupName("Auth");

        return endpoints;
    }
}
