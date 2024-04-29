using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Microsoft.Extensions.Configuration;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Nutritionist.FetchingPendingVerificationRequests;
using Omniom.Domain.Shared.Repositories;
using Omniom.Domain.Nutritionist.CleaningModule;

namespace Omniom.Domain.Nutritionist;

public static class NutritionistModuleConfiguration
{
    public static void AddNutritionistModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<RegisterNutritionistCommandHandler>();
        services.AddScoped<ICommandHandler<RegisterNutritionistCommand>, TransactionalRegisterNutritionistCommandHandler>();
        services.AddScoped<ICommandHandler<CleanupNutritionistModuleCommand>, CleanupNutritionistModuleCommandHandler>();
        services.AddScoped<IQueryHandler<GetPendingVerificationRequestsQuery, List<PendingVerificationListItem>>, GetPendingVerificationRequestsQueryHandler>();
        services.AddDbContext<NutritionistDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
        services.AddScoped<ITransactions, NutritionistContextTransactions>();
    }

    public static void MapNutritionistEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapRegisterNutritionistEndpoint();
        endpoints.MapGetPendingVerificationRequestsEndpoint();
    }
}