using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
using Omniom.Domain.Catalogue.Meals.GettingMeal;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Catalogue.Shared;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Catalogue.Meals;
public static class MealsConfig
{
    public static void AddMealsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MealsDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("OmniomDatabase"));
        });
        services.AddTransient(sp =>
        {
            return sp.GetRequiredService<MealsDbContext>().Set<UserMealDao>().AsNoTracking().AsQueryable();
        });
        services.AddTransient<IQueryHandler<GetUserMealsQuery, IEnumerable<MealCatalogueItem>>, GetUserMealsQueryHandler>();
    }

    public static IEndpointRouteBuilder MapMealsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapCreateMeal();
        endpoints.MapGetUserMeals();
        return endpoints;
    }
}
