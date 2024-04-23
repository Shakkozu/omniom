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
    public List<FormFile> Files { get; set; }
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
            [FromForm] RegisterNutritionistRequest request,
            ILogger < RegisterNutritionistCommandHandler > logger,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var userId = userIdProvider.GetUserId();
            logger.LogInformation($"User with id {userId} is registering as nutritionist");
            // Registering user as nutritionist logic
        });
        return endpoints;
    }
}
