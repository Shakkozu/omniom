using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Nutritionist.FetchingUserVerificationRequestDetails;
public record UserVerificationRequestDetails
{


    public Guid UserId { get; init; }
    public string Name { get; init; }
    public string Surname { get; init; }
    public string City { get; init; }
    public string Email { get; init; }

    public List<Attachment> Attachments { get; init; } = [];
}

public static class Route
{
    public static IEndpointRouteBuilder MapGetUserVerificationRequestDetailsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(NutritionistRoutes.UserVerificationRequestDetails, async (
            HttpContext context,
            ILogger<GetUserVerificationRequestDetailsQuery> logger,
            Guid userId,
            [FromServices] IFetchUserIdentifierFromContext userIdProvider,
            [FromServices] IQueryHandler<GetUserVerificationRequestDetailsQuery, UserVerificationRequestDetails> handler,
            CancellationToken ct) =>
        {
            var query = new GetUserVerificationRequestDetailsQuery(userId);

            var response = await handler.HandleAsync(query, ct);
            return Results.Ok(response);
        });
        return endpoints;
    }
}

public record GetUserVerificationRequestDetailsQuery(Guid UserId) : IQuery;

internal class GetUserVerificationRequestDetailsQueryHandler : IQueryHandler<GetUserVerificationRequestDetailsQuery, UserVerificationRequestDetails>
{
    private readonly NutritionistDbContext _nutritionistDbContext;

    public GetUserVerificationRequestDetailsQueryHandler(NutritionistDbContext nutritionistDbContext)
    {
        _nutritionistDbContext = nutritionistDbContext;
    }

    public async Task<UserVerificationRequestDetails?> HandleAsync(GetUserVerificationRequestDetailsQuery query, CancellationToken ct)
    {
        return await _nutritionistDbContext.VerificationRequests
            .Where(x => x.UserId == query.UserId)
            .Include(x => x.Attachments)
            .Join(_nutritionistDbContext.Nutritionists,
                verificationRequest => verificationRequest.UserId,
                nutritionist => nutritionist.UserId,
                (verificationRequest, nutritionist) => new UserVerificationRequestDetails
                {
                    Email = nutritionist.Email,
                    City = nutritionist.City,
                    UserId = verificationRequest.UserId,
                    Name = nutritionist.FirstName,
                    Surname = nutritionist.LastName,
                    Attachments = verificationRequest.Attachments.Select(request => request.Attachment).ToList()
                })
            .AsNoTracking()
            .FirstOrDefaultAsync(ct);
    }
}



