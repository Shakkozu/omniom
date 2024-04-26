using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.UserProfile.NutritionTargetsConfiguration.Contract;
using Omniom.Domain.UserProfile.Storage;

namespace Omniom.Domain.UserProfile.NutritionTargetsConfiguration.GettingNutritionTargetsConfiguration;
internal record GetNutritionTargetsConfigurationQuery(Guid userId) : IQuery;

internal class GetNutritionTargetsConfigurationQueryHandler : IQueryHandler<GetNutritionTargetsConfigurationQuery, NutritionTargetConfiguration>
{
    private readonly UserProfileDbContext _userProfileDbContext;

    public GetNutritionTargetsConfigurationQueryHandler(UserProfileDbContext userProfileDbContext)
    {
        _userProfileDbContext = userProfileDbContext;
    }

    public async Task<NutritionTargetConfiguration> HandleAsync(GetNutritionTargetsConfigurationQuery query, CancellationToken ct)
    {
        var userProfile = await _userProfileDbContext.UserProfileConfigurations.SingleOrDefaultAsync(x => x.UserId == query.userId, ct);
        return userProfile?.NutritionTarget ?? NutritionTargetConfiguration.Default;
    }
}

internal static class Route
{
    internal  static IEndpointRouteBuilder MapGetNutritionTargetsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(NutritionTargetsRoutes.GetNutritionTargets,
            async (
            HttpContext context,
            [FromServices] IQueryHandler<GetNutritionTargetsConfigurationQuery, NutritionTargetConfiguration> queryHandler,
            CancellationToken ct,
            ILogger<GetNutritionTargetsConfigurationQueryHandler> logger,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var query = new GetNutritionTargetsConfigurationQuery(userIdProvider.GetUserId());

            try
            {
                return await queryHandler.HandleAsync(query, ct);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error while handling GetNutritionTargetsConfigurationQuery");
                context.Response.StatusCode = 500;
                return null;
            }
        }).RequireAuthorization();

        return endpoints;
    }
}

