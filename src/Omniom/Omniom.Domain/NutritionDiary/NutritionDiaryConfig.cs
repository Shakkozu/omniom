using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.RegisterUser;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.InitializingModuleData;
using Omniom.Domain.Catalogue.Products.SearchProducts;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetNutritionDay;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.RemovingNutritionEntries;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.NutritionDiary;

public static class NutritionDiaryConfig
{
    public static void AddNutritionDiary(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<GetNutritionDayQueryHandler>();
        services.AddTransient<GetShortSummaryForDaysQueryHandler>();
        services.AddTransient<SaveMealNutritionEntriesCommandHandler>();
        services.AddTransient<ICommandHandler<RemoveNutritionEntryCommand>, RemoveNutritionEntryCommandHandler>();
        services.AddTransient<ICommandHandler<SaveMealNutritionEntriesCommand>>(ctx =>
            new TransactionalSaveMealNutritionEntriesCommandHandler(
                ctx.GetRequiredService<SaveMealNutritionEntriesCommandHandler>(),
                ctx.GetRequiredService<NutritionContextTransactions>()));

        services.AddDbContext<NutritionDiaryDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
    }

    public static IEndpointRouteBuilder MapNutritionDiaryEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGetShortSummaryEndpoint();
        endpointRouteBuilder.MapGetNutritionDayDetails();
        endpointRouteBuilder.MapAddNutritionEntriesEndpoint();
        endpointRouteBuilder.MapRemoveNutritionEntryEndpoint();

        return endpointRouteBuilder;
    }
}