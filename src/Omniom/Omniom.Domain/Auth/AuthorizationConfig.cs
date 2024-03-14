using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Omniom.Domain.Auth.Login;
using Omniom.Domain.Auth.RegisterUser;
using Omniom.Domain.Auth.Storage;

namespace Omniom.Domain.Auth;

internal record JwtSettings
{
    public string Secret { get; init; }
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public int TokenExpirationInMinutes { get; init; }
}

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

        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        serviceCollection.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,                
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSettings.Secret))
            };
        });
        return serviceCollection;
    }

    public static IEndpointRouteBuilder MapAuthenticationModuleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapLoginEndpoint();
        endpoints.MapRegisterUserEndpoint();

        endpoints.MapGet("/api/weather", () =>
        {
            return "sunny";
        }).RequireAuthorization();

        return endpoints;
    }
}