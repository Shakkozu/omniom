using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;

namespace Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
public static class Route
{
    public const string GetShortSummaryForDays = "/api/nutrition-diary/summary";

    public static IEndpointRouteBuilder MapGetShortSummaryEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGet(GetShortSummaryForDays, async(
            [FromQuery] DateTime dateFrom,
            [FromQuery] DateTime dateTo,
            [FromServices] GetShortSummaryForDaysQueryHandler handler,
            HttpContext context,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken ct
            ) =>
        {
            var startDate = context.Request.Query["dateFrom"];
            var endDate = context.Request.Query["dateTo"];

            if(dateFrom == default || dateTo == default)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Missing required parameters");
                return;
            }

            var query = new GetShortDaysSummary(userIdProvider.GetUserId(), dateFrom, dateTo);
            var result = await handler.HandleAsync(query, context.RequestAborted);

            await context.Response.WriteAsJsonAsync(result);
        });

        return endpointRouteBuilder;
    }

}
