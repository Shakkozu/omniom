using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Omniom.Domain.NutritionDiary.GetShortSummaryForDateRange;
public static class Route
{
    public const string GetShortSummaryForDays = "/api/nutrition-diary/days-summary";

    public static IEndpointRouteBuilder MapGetShortSummaryEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapGet(GetShortSummaryForDays, async(
            [FromQuery] DateTime dateFrom,
            [FromQuery] DateTime dateTo,
            [FromServices] GetShortSummaryForDaysQueryHandler handler,
            HttpContext context,
            CancellationToken ct
            ) =>
        {
            var userId = context.User.Identity.Name ?? throw new UnauthorizedAccessException();
            var startDate = context.Request.Query["dateFrom"];
            var endDate = context.Request.Query["dateTo"];

            if(dateFrom == default || dateTo == default)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Missing required parameters");
                return;
            }

            var query = new GetShortDaysSummary(Guid.Parse(userId), dateFrom, dateTo);
            var result = await handler.HandleAsync(query, context.RequestAborted);

            await context.Response.WriteAsJsonAsync(result);
        });

        return endpointRouteBuilder;
    }

}
