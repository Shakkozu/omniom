using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.RegisterUser;
using Omniom.Domain.NutritionDiary.AddProductToDiary;
using Omniom.Domain.NutritionDiary.GetDiary;
using Omniom.Domain.NutritionDiary.GetNutritionDay;
using Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
using Omniom.Domain.NutritionDiary.ModifyProductPortion;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.ProductsCatalogue.SearchProducts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.NutritionDiary;
public static class NutritionDiaryConfig
{
    public static void AddNutritionDiary(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<AddProductToDiaryCommandHandler>();
        services.AddTransient<ModifyProductPortionCommandHandler>();
        services.AddTransient<GetNutritionDayQueryHandler>();
        services.AddTransient<GetShortSummaryForDaysQueryHandler>();

        services.AddDbContext<NutritionDiaryDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
    }

    public static IEndpointRouteBuilder MapNutritionDiaryEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGetShortSummaryEndpoint();
        endpointRouteBuilder.MapGetNutritionDayDetails();

        return endpointRouteBuilder;
    }

    public static void AddNutritionDiaryEntries(this WebApplication application, IConfiguration configuration)
    {
        using (var scope = application.Services.CreateScope())
        {
            var getUserIdQueryHandler = scope.ServiceProvider.GetRequiredService<GetUserIdByEmailHandlerQueryHandler>();
            var searchProductsQueryHandler = scope.ServiceProvider.GetRequiredService<SearchProductsQueryHandler>();
            var addProductToDiaryCommandHandler = scope.ServiceProvider.GetRequiredService<AddProductToDiaryCommandHandler>();
            var superuserId = getUserIdQueryHandler.HandleAsync(new GetUserIdByEmailQuery(configuration.GetValue<string>("Administrator:Email"))).GetAwaiter().GetResult();
            AddNutritionEntries(superuserId, searchProductsQueryHandler, addProductToDiaryCommandHandler).GetAwaiter().GetResult();
        }
    }

    private static async Task AddNutritionEntries(string userId, 
        SearchProductsQueryHandler searchProducts,
        AddProductToDiaryCommandHandler addProductToDiaryCommandHandler)
    {
        var products = (await searchProducts.HandleAsync(new SearchProductsQuery(""), CancellationToken.None)).Products;
        if (!products.Any())
            return;

        await addProductToDiaryCommandHandler.HandleAsync(new AddProductToDiaryCommand(
            Guid.Parse(userId),
            products.First().Guid,
            Guid.NewGuid(),
            100,
            NutritionDiary.Storage.MealType.Breakfast,
            DateTime.Now
            ), CancellationToken.None);
        await addProductToDiaryCommandHandler.HandleAsync(new AddProductToDiaryCommand(
            Guid.Parse(userId),
            products.First().Guid,
            Guid.NewGuid(),
            200,
            NutritionDiary.Storage.MealType.SecondBreakfast,
            DateTime.Now
            ), CancellationToken.None);
        await addProductToDiaryCommandHandler.HandleAsync(new AddProductToDiaryCommand(
            Guid.Parse(userId),
            products.First().Guid,
            Guid.NewGuid(),
            300,
            NutritionDiary.Storage.MealType.Dinner,
            DateTime.Now
            ), CancellationToken.None);
        await addProductToDiaryCommandHandler.HandleAsync(new AddProductToDiaryCommand(
            Guid.Parse(userId),
            products.Last().Guid,
            Guid.NewGuid(),
            150,
            NutritionDiary.Storage.MealType.Dinner,
            DateTime.Now
            ), CancellationToken.None);


    }
}
