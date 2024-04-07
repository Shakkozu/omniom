using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.NutritionDiary.AddNutritionEntries;
public static class Route
{
    public const string AddNutritionEntries = "/api/nutrition-diary/entries";

    public static IEndpointRouteBuilder MapAddNutritionEntriesEndpoint (this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapPost(AddNutritionEntries, async (
            [FromBody] SaveMealNutritionEntriesRequest RequestBody,
            [FromServices] ICommandHandler<SaveMealNutritionEntriesCommand> addNutritionEntriesCommandHandler,
            HttpContext context,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken ct
            ) =>
        {
            var command = new SaveMealNutritionEntriesCommand(
                RequestBody.Products,
                (MealType)Enum.Parse(typeof(MealType), RequestBody.MealType),
                RequestBody.SelectedDay,
                userIdProvider.GetUserId()
            );
            await addNutritionEntriesCommandHandler.HandleAsync(command, ct);
            context.Response.StatusCode = 204;
        });

        return endpointRouteBuilder;
    }

}
