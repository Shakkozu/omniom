using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.LoggingOut;
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
        serviceCollection.AddTransient<GetUserIdByEmailHandlerQueryHandler>();
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
        serviceCollection.AddScoped<HttpContextAccessor>();
        serviceCollection.AddScoped<IFetchUserIdentifierFromContext>(provider =>
        {
            var httpContextAccessor = provider.GetRequiredService<IHttpContextAccessor>();
            return new HttpContextUserIdProvider(httpContextAccessor);
        });

        return serviceCollection;
    }

    public static void AddSuperuser(this WebApplication application, IConfiguration configuration)
    {
        using (var scope = application.Services.CreateScope())
        {
            var registerUser = scope.ServiceProvider.GetRequiredService<RegisterUserCommandHandler>();
            var request = new UserForRegistrationDto
            {
                Email = configuration.GetValue<string>("Administrator:Email"),
                Password = configuration.GetValue<string>("Administrator:Password"),
                ConfirmPassword = configuration.GetValue<string>("Administrator:Password"),
            };

            registerUser.HandleAsync(request, CancellationToken.None).GetAwaiter().GetResult();
        }
    }

    public static IEndpointRouteBuilder MapAuthenticationModuleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapLoginEndpoint();
        endpoints.MapLogoutEndpoint();
        endpoints.MapRegisterUserEndpoint();

        return endpoints;
    }
}