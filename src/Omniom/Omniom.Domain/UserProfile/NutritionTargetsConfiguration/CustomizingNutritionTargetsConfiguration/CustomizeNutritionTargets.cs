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

namespace Omniom.Domain.UserProfile.NutritionTargetsConfiguration.CustomizingNutritionTargetsConfiguration;

internal record CustomizeNutritionTargetsCommand(Guid UserId, NutritionTargetConfiguration NutritionTarget);

internal class CustomizeNutritionTargetsCommandHandler : ICommandHandler<CustomizeNutritionTargetsCommand>
{
    private readonly UserProfileDbContext _userProfileDbContext;

    public CustomizeNutritionTargetsCommandHandler(UserProfileDbContext userProfileDbContext)
    {
        _userProfileDbContext = userProfileDbContext;
    }

    public async Task HandleAsync(CustomizeNutritionTargetsCommand command, CancellationToken ct)
    {
        var userProfile = await _userProfileDbContext.UserProfileConfigurations.SingleOrDefaultAsync(x => x.UserId == command.UserId, ct);
        if (userProfile == null)
        {
            userProfile = new UserProfileConfiguration
            {
                UserId = command.UserId,
            };
        }
        userProfile.NutritionTarget = command.NutritionTarget;
        _userProfileDbContext.UserProfileConfigurations.Update(userProfile);
        await _userProfileDbContext.SaveChangesAsync(ct);
    }
}

internal static class Route
{
    internal static IEndpointRouteBuilder MapSetNutritionTargetsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(NutritionTargetsRoutes.SetNutritionTargets, async (HttpContext context,
            [FromServices] ICommandHandler<CustomizeNutritionTargetsCommand> commandHandler,
            [FromBody] NutritionTargetConfiguration request,
            CancellationToken ct,
            ILogger<CustomizeNutritionTargetsCommandHandler> logger,
            IFetchUserIdentifierFromContext userIdProvider
            ) =>
        {
            var command = new CustomizeNutritionTargetsCommand(userIdProvider.GetUserId(), request);
            try
            {
                await commandHandler.HandleAsync(command, ct);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Customizing nutrition targets failed with error");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("Customizing nutrition targets failed with error");
            }

            context.Response.StatusCode = StatusCodes.Status204NoContent;
        });

        return endpoints;
    }
}
