﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Omniom.Domain.NutritionDiary.Storage;
using Omniom.Domain.Shared.BuildingBlocks;
using Omniom.Domain.Shared.Exceptions;

namespace Omniom.Domain.NutritionDiary.RemovingNutritionEntries;

internal static class Route
{
    public const string RemoveNutritionEntry = "/api/nutrition-diary/{id:guid}";

    public static IEndpointRouteBuilder MapRemoveNutritionEntryEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapDelete(RemoveNutritionEntry, async (
            [FromRoute] Guid Id,
            [FromServices] ICommandHandler<RemoveNutritionEntryCommand> removeNutritionEntryCommandHandler,
            HttpContext context,
            ILogger<RemoveNutritionEntryCommandHandler> _logger,
            CancellationToken ct) =>
        {
            var userId = context.User.Identity.Name ?? throw new UnauthorizedAccessException();
            var command = new RemoveNutritionEntryCommand
            {
                UserId = Guid.Parse(userId),
                EntryId = Id,
                Date = DateTime.UtcNow
            };
            try
            {
                await removeNutritionEntryCommandHandler.HandleAsync(command, ct);
            }
            catch (ResourceNotFoundException)
            {
                context.Response.StatusCode = 404;
                return;

            }
            catch(Exception e)
            {
                _logger.LogError(e, "Error while removing nutrition entry");
                context.Response.StatusCode = 500;
                return;
            }


            context.Response.StatusCode = 204;
        });

        return endpointRouteBuilder;
    }

}
internal class RemoveNutritionEntryCommand : ICommand
{
    public Guid UserId { get; set; }
    public Guid EntryId { get; set; }
    public DateTime Date { get; set; }
}

internal class RemoveNutritionEntryCommandHandler : ICommandHandler<RemoveNutritionEntryCommand>
{
    private readonly NutritionDiaryDbContext _dbContext;

    public RemoveNutritionEntryCommandHandler(NutritionDiaryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(RemoveNutritionEntryCommand command, CancellationToken ct)
    {
        var entry = await _dbContext.DiaryEntries
            .Where(x => 
                x.UserId == command.UserId &&
                x.Guid == command.EntryId &&
                x.DateTime.Date == command.Date.ToUniversalTime().Date)
            .SingleOrDefaultAsync(ct);

        if (entry == null)
        {
            throw new ResourceNotFoundException("Nutrition Entry not found");
        }

        _dbContext.DiaryEntries.Remove(entry);
        await _dbContext.SaveChangesAsync(ct);
    }
}


