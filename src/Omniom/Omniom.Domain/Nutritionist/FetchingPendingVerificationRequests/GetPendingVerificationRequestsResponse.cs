using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Nutritionist.FetchingPendingVerificationRequests;

public record PendingVerificationListItem
{
    public Guid UserId { get; init; }
    public string Name { get; init; }
    public string Surname { get; init; }
    public string Email { get; init; }
}

public static class Route
{
    internal static IEndpointRouteBuilder MapGetPendingVerificationRequestsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(NutritionistRoutes.PendingVerificationRequests, async (
            HttpContext context,
            ILogger<GetPendingVerificationRequestsQuery> logger,
            [FromServices] IFetchUserIdentifierFromContext userIdProvider,
            [FromServices] IQueryHandler<GetPendingVerificationRequestsQuery, List<PendingVerificationListItem>> handler,
            CancellationToken ct) =>
        {
            var userId = userIdProvider.GetUserId();
            var query = new GetPendingVerificationRequestsQuery(userId);

            var response = await handler.HandleAsync(query, ct);
            return Results.Ok(response);
        });
        return endpoints;
    }
}

internal record GetPendingVerificationRequestsQuery(Guid UserId) : IQuery;
internal record GetPendingVerificationRequestsQueryHandler : IQueryHandler<GetPendingVerificationRequestsQuery, List<PendingVerificationListItem>>
{
    private readonly NutritionistDbContext _nutritionistDbContext;

    public GetPendingVerificationRequestsQueryHandler(NutritionistDbContext nutritionistDbContext)
    {
        _nutritionistDbContext = nutritionistDbContext;
    }

    public async Task<List<PendingVerificationListItem>> HandleAsync(GetPendingVerificationRequestsQuery query, CancellationToken ct)
    {
        return await _nutritionistDbContext.VerificationRequests
            .Where(x => x.Status == NutritionistVerificationStatus.Pending.ToString())
            .Join(_nutritionistDbContext.Nutritionists,
                verificationRequest => verificationRequest.UserId,
                nutritionist => nutritionist.UserId,
                (verificationRequest, nutritionist) => new PendingVerificationListItem
                {
                    Email = nutritionist.Email,
                    UserId = verificationRequest.UserId,
                    Name = nutritionist.FirstName,
                    Surname = nutritionist.LastName
                })
            .ToListAsync(ct);
    }
}
