using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

namespace Omniom.Domain.Nutritionist;

public static class NutritionistModuleConfiguration
{
    public static void AddNutritionistModule(this IServiceCollection services)
    {
        services.AddScoped<ICommandHandler<RegisterNutritionistCommand>, RegisterNutritionistCommandHandler>();
    }

    public static void MapNutritionistEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapRegisterNutritionistEndpoint();
    }
}