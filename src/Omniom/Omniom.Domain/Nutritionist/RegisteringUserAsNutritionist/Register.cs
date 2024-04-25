using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Omniom.Domain.UserProfile.MealsConfiguration.CustomizingAvailableMeals;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
internal class Register
{
}

public class RegisterNutritionistRequest
{
    public string Name { get; set; }
    public string Surname { get; set; }

    public string City { get; set; }
    public bool TermsAndConditionsAccepted { get; set; }
    public List<string> FilesBase64Encoded { get; set; }
}

internal record RegisterNutritionistCommand(Guid UserId);
internal class RegisterNutritionistCommandHandler : ICommandHandler<RegisterNutritionistCommand>
{
    

    public async Task HandleAsync(RegisterNutritionistCommand command, CancellationToken ct)
    {
        
    }
}

internal static class Route
{
    internal static IEndpointRouteBuilder MapRegisterNutritionistEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(NutritionistRoutes.RegisterNutritionist, async (
            HttpContext context,
            [FromBody] RegisterNutritionistRequest request,
            ILogger < RegisterNutritionistCommandHandler > logger,
            [FromServices] ICommandHandler<RegisterNutritionistCommand> handler,
            CancellationToken ct,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var userId = userIdProvider.GetUserId();

            logger.LogInformation($"User with id {userId} is registering as nutritionist");
            try
            {
                await handler.HandleAsync(new RegisterNutritionistCommand(userId), ct);
                return Results.Ok();
                
            }
            catch (Exception)
            {

                logger.LogError("User with id {userId} failed to register as nutritionist", userId);
                return Results.BadRequest("Failed to register as nutritionist");

            }
        });
        return endpoints;
    }
}
