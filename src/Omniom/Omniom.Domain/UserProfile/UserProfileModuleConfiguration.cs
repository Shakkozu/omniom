using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;
using Omniom.Domain.UserProfile.GettingUserMealsConfiguration;
using Omniom.Domain.UserProfile.Storage;

namespace Omniom.Domain.UserProfile;

public static class UserProfileModuleConfiguration
{
    public static IServiceCollection AddUserProfileModule(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        serviceCollection.AddDbContext<UserProfileDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
        serviceCollection.AddTransient<IQueryHandler<GetMealsConfigurationQuery, IEnumerable<MealConfigurationItem>>, GetMealsConfigurationCommandHandler>();
        serviceCollection.AddTransient<ICommandHandler<CustomizeAvailableMealsConfigurationCommand>, CustomizeAvailableMealsConfigurationCommandHandler>();
        return serviceCollection;
    }

    public static IEndpointRouteBuilder MapUserProfileModuleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGetMealsConfigurationEndpoint();
        endpoints.MapModifyAvailableMealsConfigurationEndpoint();
        return endpoints;
    }

}
