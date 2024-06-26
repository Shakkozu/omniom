﻿using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Nutritionist.Storage;
using Omniom.Domain.Shared.Repositories;
using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Shared.Exceptions;

namespace Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

public class RegisterNutritionistRequest
{
    public string Name { get; set; }
    public string Surname { get; set; }

    public string City { get; set; }
    public bool TermsAndConditionsAccepted { get; set; }
    public List<Attachment> Attachments { get; set; }
    public string Email { get; set; }
}

internal static class Route
{
    internal static IEndpointRouteBuilder MapRegisterNutritionistEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(NutritionistRoutes.RegisterNutritionist, async (
            HttpContext context,
            [FromBody] RegisterNutritionistRequest request,
            ILogger<RegisterNutritionistCommandHandler> logger,
            [FromServices] ICommandHandler<RegisterNutritionistCommand> handler,
            CancellationToken ct,
            IFetchUserIdentifierFromContext userIdProvider) =>
        {
            var userId = userIdProvider.GetUserId();
            logger.LogInformation($"User with id {userId} is registering as nutritionist");

            try
            {
                var validationResult = new AttachmentsValidator(AttachmentsValidatorConfig.Default).ValidateFiles(request.Attachments?.Select(x => x.FileContentBase64Encoded).ToArray());
                if (!validationResult.IsValid)
                {
                    logger.LogError("User with id {userId} failed to register as nutritionist due to invalid files. {validationResult}", userId, validationResult.ErrorMessage);
                    return Results.BadRequest(validationResult.ErrorMessage);
                }

                await handler.HandleAsync(new RegisterNutritionistCommand(userId, request), ct);
                return Results.Ok();
            }
            catch (Exception e)
            {
                logger.LogError(e, "User with id {userId} failed to register as nutritionist", userId);
                return Results.BadRequest("Failed to register as nutritionist");
            }
        });
        return endpoints;
    }
}

public record RegisterNutritionistCommand
{
    public RegisterNutritionistCommand(Guid userId, RegisterNutritionistRequest request)
    {
        UserId = userId;
        Request = request;
        if (!request.TermsAndConditionsAccepted)
        {
            throw new CommandValidationException("Terms and conditions must be accepted");
        }
    }

    public Guid UserId { get; }
    public RegisterNutritionistRequest Request { get; }
}

internal class RegisterNutritionistCommandHandler : ICommandHandler<RegisterNutritionistCommand>
{
    private readonly NutritionistDbContext _nutritionistDbContext;
    private readonly ILogger<RegisterNutritionistCommandHandler> _logger;

    public RegisterNutritionistCommandHandler(NutritionistDbContext nutritionistDbContext,
        ILogger<RegisterNutritionistCommandHandler> logger)
    {
        _nutritionistDbContext = nutritionistDbContext;
        _logger = logger;
    }

    public async Task HandleAsync(RegisterNutritionistCommand command, CancellationToken ct)
    {
        var requestGuid = Guid.NewGuid();
        var userAlreadyRegisteredAsNutritionist = await _nutritionistDbContext.Nutritionists.AnyAsync(x => x.UserId == command.UserId, ct);
        if (userAlreadyRegisteredAsNutritionist)
        {
            _logger.LogError("User with id {userId} is already registered as nutritionist", command.UserId);
            throw new InvalidOperationException("User already registered as nutritionist");
        }
        var nutritionist = new Storage.Nutritionist
        {
            UserId = command.UserId,
            FirstName = command.Request.Name,
            LastName = command.Request.Surname,
            TermsAndConditionsAccepted = command.Request.TermsAndConditionsAccepted,
            IsVerified = false,
            Email = command.Request.Email,
            City = command.Request.City,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (command.Request.Attachments.Any())
        {
            var request = new NutritionistVerificationRequest
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Guid = requestGuid,
                Status = NutritionistVerificationStatus.Pending.ToString(),
                UserId = command.UserId,
                Attachments = command.Request.Attachments.Select(x => new NutritionistVerificationAttachment
                {
                    Attachment = x,
                    RequestGuid = requestGuid
                }).ToList()
            };
            _nutritionistDbContext.VerificationRequests.Add(request);
        }

        _nutritionistDbContext.Nutritionists.Add(nutritionist);
        await _nutritionistDbContext.SaveChangesAsync(ct);
    }
}

internal class TransactionalRegisterNutritionistCommandHandler : ICommandHandler<RegisterNutritionistCommand>
{
    private readonly ITransactions _transactions;
    private readonly RegisterNutritionistCommandHandler _inner;

    public TransactionalRegisterNutritionistCommandHandler(ITransactions transactions, RegisterNutritionistCommandHandler inner)
    {
        _transactions = transactions;
        _inner = inner;
    }

    public async Task HandleAsync(RegisterNutritionistCommand command, CancellationToken ct)
    {
        var transaction = await _transactions.BeginTransactionAsync();
        await _inner.HandleAsync(command, ct);
        await transaction.CommitAsync();
    }
}