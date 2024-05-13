using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Omniom.Domain.Nutritionist.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Omniom.Domain.Shared.BuildingBlocks;
using Microsoft.Extensions.Logging;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

namespace Omniom.Domain.Nutritionist.Verification.CreatingVerificationRequests;

public record CreateVerificationRequest(List<Attachment> Attachments);
public record CreateVerificationRequestCommand(List<Attachment> Attachments, Guid UserId);
internal static class Route
{
    internal static IEndpointRouteBuilder MapCreateVerificationRequestEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(NutritionistRoutes.CreateVerificationRequest, async (
            HttpContext context,
            [FromBody] CreateVerificationRequest request,
            ILogger<CreateVerificationRequestCommand> logger,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken ct,
            [FromServices] ICommandHandler<CreateVerificationRequestCommand> commandHandler) =>
        {
            var userId = userIdProvider.GetUserId();
            if (request.Attachments.Count == 0)
            {
                logger.LogWarning("User {userId} tried to create verification request without attachments", userId);
                return Results.BadRequest("Attachments are required");
            }

            var validationResult = new AttachmentsValidator(AttachmentsValidatorConfig.Default).ValidateFiles(request.Attachments?.Select(x => x.FileContentBase64Encoded).ToArray());
            if (!validationResult.IsValid)
            {
                logger.LogError("User with id {userId} failed to register as nutritionist due to invalid files. {validationResult}", userId, validationResult.ErrorMessage);
                return Results.BadRequest(validationResult.ErrorMessage);
            }

            var command = new CreateVerificationRequestCommand(request.Attachments, userId);
            await commandHandler.HandleAsync(command, ct);
            return Results.Ok();
        });

        return endpoints;
    }
}

internal class CreateVerificationRequestCommandHandler : ICommandHandler<CreateVerificationRequestCommand>
{
    private readonly NutritionistDbContext _nutritionistDbContext;
    private readonly ILogger _logger;

    public CreateVerificationRequestCommandHandler(
        NutritionistDbContext nutritionistDbContext,
        ILogger<CreateVerificationRequestCommand> logger)
    {
        _nutritionistDbContext = nutritionistDbContext;
        _logger = logger;
    }

    public async Task HandleAsync(CreateVerificationRequestCommand command, CancellationToken ct)
    {
        var userHasVerificationRequest = await _nutritionistDbContext.VerificationRequests.AnyAsync(x => x.UserId == command.UserId, ct);
        if (userHasVerificationRequest)
        {
            _logger.LogError("User {userId} tried to create multiple verification requests", command.UserId);
            throw new InvalidOperationException("User already has a pending verification request");
        }
        
        var requestGuid = Guid.NewGuid();
        var request = new NutritionistVerificationRequest
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Guid = requestGuid,
            Status = NutritionistVerificationStatus.Pending.ToString(),
            UserId = command.UserId,
            Attachments = command.Attachments.Select(x => new NutritionistVerificationAttachment
            {
                Attachment = x,
                RequestGuid = requestGuid
            }).ToList()
        };
        _nutritionistDbContext.VerificationRequests.Add(request);
        await _nutritionistDbContext.SaveChangesAsync(ct);
    }
}
