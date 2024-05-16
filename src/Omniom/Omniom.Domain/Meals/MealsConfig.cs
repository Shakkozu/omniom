using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Omniom.Domain.Meals.CreatingNewMeal;
using Omniom.Domain.Meals.GettingMeal;
using Omniom.Domain.Meals.Storage;

namespace Omniom.Domain.Meals;
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
    }

    public static IEndpointRouteBuilder MapMealsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapCreateMeal();
        endpoints.MapGetUserMeals();
        return endpoints;
    }
}
