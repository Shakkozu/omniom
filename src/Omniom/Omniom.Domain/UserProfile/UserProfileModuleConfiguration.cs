using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;
using Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
using Omniom.Domain.UserProfile.MealsConfiguration.GettingUserMealsConfiguration;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.CustomizingNutritionTargetsConfiguration;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.GettingNutritionTargetsConfiguration;
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

        serviceCollection.AddTransient<IQueryHandler<GetNutritionTargetsConfigurationQuery, NutritionTargetConfiguration>, GetNutritionTargetsConfigurationQueryHandler>();
        serviceCollection.AddTransient<ICommandHandler<CustomizeNutritionTargetsCommand>, CustomizeNutritionTargetsCommandHandler>();
        return serviceCollection;
    }

    public static IEndpointRouteBuilder MapUserProfileModuleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGetMealsConfigurationEndpoint();
        endpoints.MapModifyAvailableMealsConfigurationEndpoint();
        endpoints.MapSetNutritionTargetsEndpoint();
        endpoints.MapGetNutritionTargetsEndpoint();
        return endpoints;
    }

}
