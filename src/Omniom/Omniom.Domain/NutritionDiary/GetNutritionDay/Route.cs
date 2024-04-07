using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.NutritionDiary.GetDiary;

namespace Omniom.Domain.NutritionDiary.GetNutritionDay;
public static class Route
{
    public const string GetNutritionDay = "/api/nutrition-diary/details";

    public static IEndpointRouteBuilder MapGetNutritionDayDetails(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGet(GetNutritionDay, async (
            [FromQuery] DateTime nutritionDay,
            [FromServices] GetNutritionDayQueryHandler handler,
            HttpContext context,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken ct
            ) =>
        {
            if (nutritionDay == default)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Missing required parameters. Nutrition-day is required");
                return;
            }

            var query = new GetNutritionDayQuery(userIdProvider.GetUserId(), nutritionDay);
            var result = await handler.HandleAsync(query, context.RequestAborted);
            await context.Response.WriteAsJsonAsync(result, ct);
        });

        return endpointRouteBuilder;
    }

}
