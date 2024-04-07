using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.NutritionDiary.AddNutritionEntries;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetNutritionDay;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Repositories;

namespace Omniom.Domain.NutritionDiary;
public static class NutritionDiaryConfig
{
    public static void AddNutritionDiary(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<GetNutritionDayQueryHandler>();
        services.AddTransient<GetShortSummaryForDaysQueryHandler>();
        services.AddTransient<SaveNutritionEntriesCommandHandler>();
        services.AddTransient<ICommandHandler<SaveNutritionEntriesCommand>>(ctx =>
            new TransactionalSaveNutritionEntriesCommandHandler(
                ctx.GetRequiredService<SaveNutritionEntriesCommandHandler>(),
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

        return endpointRouteBuilder;
    }

    public static void AddNutritionDiaryEntries(this WebApplication application, IConfiguration configuration)
    {
        using (var scope = application.Services.CreateScope())
        {
            var getUserIdQueryHandler = scope.ServiceProvider.GetRequiredService<GetUserIdByEmailHandlerQueryHandler>();
            var searchProductsQueryHandler = scope.ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
            var addProductToDiaryCommandHandler = scope.ServiceProvider.GetRequiredService<ICommandHandler<SaveNutritionEntriesCommand>>();
            var superuserId = getUserIdQueryHandler.HandleAsync(new GetUserIdByEmailQuery(configuration.GetValue<string>("Administrator:Email"))).GetAwaiter().GetResult();
            AddNutritionEntries(superuserId, searchProductsQueryHandler, addProductToDiaryCommandHandler, DateTime.Today).GetAwaiter().GetResult();
            AddNutritionEntries(superuserId, searchProductsQueryHandler, addProductToDiaryCommandHandler, DateTime.Today.AddDays(-1)).GetAwaiter().GetResult();
        }
    }

    private static async Task AddNutritionEntries(string userId,
        SearchProductsQueryHandler searchProducts,
        ICommandHandler<SaveNutritionEntriesCommand> addNutritionEntriesCommandHandler,
        DateTime day)
    {
        var products = (await searchProducts.HandleAsync(new SearchProductsQuery(""), CancellationToken.None)).Products;
        if (!products.Any())
            return;
        var command = new SaveNutritionEntriesCommand(
                       new[]
                       {
                new MealProductEntryDto(products.First().Guid, 100),
                new MealProductEntryDto(products.Last().Guid, 200)
            },
            MealType.Breakfast,
            day,
            Guid.Parse(userId)
        );
        var command2 = new SaveNutritionEntriesCommand(
                       new[]
                       {
                new MealProductEntryDto(products.First().Guid, 250),
                new MealProductEntryDto(products.Last().Guid, 300)
            },
            MealType.Supper,
            day,
            Guid.Parse(userId)
        );

        await addNutritionEntriesCommandHandler.HandleAsync(command, CancellationToken.None);
        await addNutritionEntriesCommandHandler.HandleAsync(command2, CancellationToken.None);
    }
}
