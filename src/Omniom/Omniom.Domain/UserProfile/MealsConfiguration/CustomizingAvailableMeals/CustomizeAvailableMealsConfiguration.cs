using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.UserProfile.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
public record CustomizeAvailableMealsConfigurationRequest
{
    public List<MealConfigurationItem> Configuration { get; set; }
}

public record MealConfigurationItem(string MealName, bool Enabled);

public class CustomizeAvailableMealsConfigurationCommand
{
    public static CustomizeAvailableMealsConfigurationCommand Create(Guid userId, IEnumerable<MealConfigurationItem> mealConfigurationItems)
    {
        var allMealTypes = Enum.GetValues<MealType>();
        if (mealConfigurationItems.Count() != allMealTypes.Length)
            throw new ArgumentException($"All meal types must be provided. Correct meal types are: ${@allMealTypes}");
        if (allMealTypes.All(x => mealConfigurationItems.All(y => Enum.Parse<MealType>(y.MealName) != x)))
            throw new ArgumentException($"All meal types must be provided. Correct meal types are: ${@allMealTypes}");


        return new CustomizeAvailableMealsConfigurationCommand(userId, mealConfigurationItems);
    }
    private CustomizeAvailableMealsConfigurationCommand(Guid userId, IEnumerable<MealConfigurationItem> mealConfigurationItems)
    {
        UserId = userId;
        MealConfigurationItems = mealConfigurationItems;
    }

    public Guid UserId { get; set; }
    public IEnumerable<MealConfigurationItem> MealConfigurationItems { get; }
}

internal class CustomizeAvailableMealsConfigurationCommandHandler : ICommandHandler<CustomizeAvailableMealsConfigurationCommand>
{
    private readonly UserProfileDbContext _userProfileDbContext;

    public CustomizeAvailableMealsConfigurationCommandHandler(UserProfileDbContext userProfileDbContext)
    {
        _userProfileDbContext = userProfileDbContext;
    }

    public async Task HandleAsync(CustomizeAvailableMealsConfigurationCommand command, CancellationToken ct)
    {
        var userProfile = await _userProfileDbContext.UserProfileConfigurations.SingleOrDefaultAsync(x => x.UserId == command.UserId, ct);
        if (userProfile == null)
        {
            userProfile = new UserProfileConfiguration
            {
                UserId = command.UserId,
            };
        }
        userProfile.MealsConfiguration = command.MealConfigurationItems.ToList();
        _userProfileDbContext.UserProfileConfigurations.Update(userProfile);
        await _userProfileDbContext.SaveChangesAsync(ct);
    }
}

public static class Route
{
    public const string ModifyMealConfiguration = "/api/user-profile/meals-configuration";

    public static IEndpointRouteBuilder MapModifyAvailableMealsConfigurationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(ModifyMealConfiguration,
            async ([FromServices] ICommandHandler<CustomizeAvailableMealsConfigurationCommand> handler,
            [FromBody] CustomizeAvailableMealsConfigurationRequest request,
            CancellationToken ct,
            ILogger<CustomizeAvailableMealsConfigurationCommandHandler> logger,
            HttpContext context,
            IFetchUserIdentifierFromContext userIdProvider) =>
            {
                var command = CustomizeAvailableMealsConfigurationCommand.Create(userIdProvider.GetUserId(), request.Configuration);
                try
                {
                    await handler.HandleAsync(command, ct);
                    context.Response.StatusCode = 204;
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Modification of meals configuration failed");
                    context.Response.StatusCode = 500;
                }
            }).RequireAuthorization();

        return endpoints;
    }
}