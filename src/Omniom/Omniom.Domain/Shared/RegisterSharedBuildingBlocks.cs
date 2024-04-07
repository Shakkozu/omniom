using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.Shared;

public static class RegisterSharedBuildingBlocks
{
    public static IServiceCollection AddSharedBuildingBlocks(this IServiceCollection services)
    {
        services.AddTransient<NutritionContextTransactions>();
        return services;
    }

}