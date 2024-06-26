﻿using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Shared.Exceptions;

namespace Omniom.Domain.Nutritionist.FetchingProfileDetails;

public record GetProfileDetailsQuery(Guid UserId);
public record GetProfileDetailsResponse(string Name,
    string Surname,
    string City,
    string Email,
    string VerificationStatus,
    string VerificationMessage)
{
}

public static class Route
{
    public static IEndpointRouteBuilder MapGetProfileInformationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(NutritionistRoutes.ProfileInformationDetails, async (
            HttpContext context,
            ILogger<GetProfileDetailsQuery> logger,
            [FromServices] IQueryHandler<GetProfileDetailsQuery, GetProfileDetailsResponse> handler,
            CancellationToken ct,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var userId = userIdProvider.GetUserId();
            try
            {
                var result = await handler.HandleAsync(new GetProfileDetailsQuery(userId), ct);
                return Results.Ok(result);
            }
            catch (ResourceNotFoundException)
            {
                return Results.NotFound();
            }
            catch (Exception e)
            {
                logger.LogError(e, "Fetching user {userId} profile details failed with error {errorMessage}", userId, e.Message);
                return Results.Problem();
            }
        });
        return endpoints;
    }
}

internal class GetProfileDetailsQueryHandler : IQueryHandler<GetProfileDetailsQuery, GetProfileDetailsResponse>
{
    private readonly NutritionistDbContext _nutritionistDbContext;
    private readonly ILogger<GetProfileDetailsQueryHandler> _logger;

    public GetProfileDetailsQueryHandler(NutritionistDbContext nutritionistDbContext,
        ILogger<GetProfileDetailsQueryHandler> _logger
        )
    {
        _nutritionistDbContext = nutritionistDbContext;
        this._logger = _logger;
    }

    public async Task<GetProfileDetailsResponse> HandleAsync(GetProfileDetailsQuery query, CancellationToken ct)
    {
        var nutritionist = await _nutritionistDbContext.Nutritionists
            .Where(x => x.UserId == query.UserId)
            .AsNoTracking()
            .SingleOrDefaultAsync(ct);

        if (nutritionist is null)
        {
            _logger.LogError("Nutritionist not found for user {userId}", query.UserId);
            throw new ResourceNotFoundException("Nutritionist not found");
        }

        var verificationRequest = await _nutritionistDbContext.VerificationRequests
            .Where(x => x.UserId == query.UserId)
            .SingleOrDefaultAsync(ct);

        return new GetProfileDetailsResponse(nutritionist.FirstName,
            nutritionist.LastName,
            nutritionist.City,
            nutritionist.Email,
            verificationRequest?.Status ?? NutritionistVerificationStatus.VerificationNotRequested.ToString(),
            verificationRequest?.Message ?? string.Empty
            );
    }
}