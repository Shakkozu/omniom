using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;
using Omniom.Domain.Shared.BuildingBlocks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Omniom.Domain.Shared.Extensions;
using Omniom.Domain.Nutritionist.FetchingProfileDetails;
using Omniom.Domain.Shared.Exceptions;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;

namespace Omniom.Domain.Nutritionist.RespondingToVerificationRequest;

public enum VerificationStatus
{
    Approved,
    Rejected
}

public record VerifyRequest(string ResponseStatus, string? Message);
public record VerifyQualificationsCommand
{
    public VerifyQualificationsCommand(Guid userId, VerificationStatus verificationStatus, string message)
    {
        VerificationStatus = verificationStatus;
        Message = message;
        UserId = userId;

        if (VerificationStatus == VerificationStatus.Rejected && string.IsNullOrEmpty(message.Trim()))
            throw new CommandValidationException("Rejecting a request requires explanation why it was rejected");
    }

    public Guid UserId { get; }
    public VerificationStatus VerificationStatus { get; }
    public string Message { get; }
}

internal static class Route
{
    public static IEndpointRouteBuilder MapVerifyQualificationsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(NutritionistRoutes.VerifyPendingQualificationsConfirmationRequest, async (
            HttpContext context,
            [FromServices] ICommandHandler<VerifyQualificationsCommand> handler,
            [FromRoute] Guid userId,
            [FromBody] VerifyRequest request,
            CancellationToken ct,
            ILogger<VerifyQualificationsCommand> logger,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var command = new VerifyQualificationsCommand(userId, Enum.Parse<VerificationStatus>(request.ResponseStatus, true), request.Message);
            try
            {
                await handler.HandleAsync(command, ct);
                return Results.Ok();
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to verify request for user {UserId}", userId);
                return Results.Problem("Failed to verify request", statusCode: StatusCodes.Status500InternalServerError);
            }
        }).RequireAdministratorRole();
        return endpoints;
    }
}

internal class VerifyQualificationsCommandHandler : ICommandHandler<VerifyQualificationsCommand>
{
    private readonly NutritionistDbContext _nutritionistDbContext;
    private readonly ILogger<VerifyQualificationsCommandHandler> _logger;

    public VerifyQualificationsCommandHandler(NutritionistDbContext nutritionistDbContext,
               ILogger<VerifyQualificationsCommandHandler> logger)
    {
        _nutritionistDbContext = nutritionistDbContext;
        _logger = logger;
    }

    public async Task HandleAsync(VerifyQualificationsCommand command, CancellationToken ct)
    {
        var verificationRequest = await _nutritionistDbContext.VerificationRequests
            .SingleOrDefaultAsync(x => x.UserId == command.UserId && x.Status == NutritionistVerificationStatus.Pending.ToString());
        if (verificationRequest == null)
            throw new ResourceNotFoundException($"Pending verification request for user {command.UserId} not found");

        verificationRequest.UpdatedAt = DateTime.UtcNow;
        verificationRequest.Message = command.Message;
        switch (command.VerificationStatus)
        {
            case VerificationStatus.Approved:
                verificationRequest.Status = NutritionistVerificationStatus.Approved.ToString();
                break;

            case VerificationStatus.Rejected:
                verificationRequest.Status = NutritionistVerificationStatus.Rejected.ToString();
                break;
        }
        await _nutritionistDbContext.SaveChangesAsync(ct);
    }
}