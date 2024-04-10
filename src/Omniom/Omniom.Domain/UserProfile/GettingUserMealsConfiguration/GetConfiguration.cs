using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;
using Omniom.Domain.UserProfile.Storage;

namespace Omniom.Domain.UserProfile.GettingUserMealsConfiguration;
public record GetMealsConfigurationQuery(Guid UserId) : IQuery;

internal class GetMealsConfigurationCommandHandler : IQueryHandler<GetMealsConfigurationQuery, IEnumerable<MealConfigurationItem>>
{
    private readonly UserProfileDbContext _dbContext;

    public GetMealsConfigurationCommandHandler(UserProfileDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<MealConfigurationItem>> HandleAsync(GetMealsConfigurationQuery query, CancellationToken ct)
    {
        var userConfig = await _dbContext.UserProfileConfigurations.SingleOrDefaultAsync(config => config.UserId == query.UserId, ct);
        if(userConfig == null)
            return GetDefaultMealsConfiguration();

        return userConfig.MealsConfiguration;
    }

    internal static IEnumerable<MealConfigurationItem> GetDefaultMealsConfiguration()
    {
        return new List<MealConfigurationItem>
        {
            new(MealType.Breakfast.ToString(), true),
            new(MealType.SecondBreakfast.ToString(), true),
            new(MealType.Snack.ToString(), true),
            new(MealType.Dinner.ToString(), true),
            new(MealType.Supper.ToString(), true),
        };
    }
}

public static class Route
{
    public const string GetMealsConfiguration = "/api/user-profile/meals-configuration";
    public static IEndpointRouteBuilder MapGetMealsConfigurationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(GetMealsConfiguration,
            async ([FromServices] IQueryHandler<GetMealsConfigurationQuery, IEnumerable<MealConfigurationItem>> handler,
            CancellationToken ct,
            IFetchUserIdentifierFromContext userIdProvider) =>
            {
                var query = new GetMealsConfigurationQuery(userIdProvider.GetUserId());
                return await handler.HandleAsync(query, ct);
            });

        return endpoints;
    }
}