using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Omniom.Domain.Auth.FetchingUserFromHttpContext;
using Omniom.Domain.Catalogue.Meals.Storage;
using Omniom.Domain.Shared.BuildingBlocks;

namespace Omniom.Domain.Catalogue.Meals.CreatingNewMeal;
internal static class Route
{
    internal static IEndpointRouteBuilder MapCreateMeal(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/dishes", async (HttpContext context,
            [FromServices] MealsDbContext dbContext,
            IFetchUserIdentifierFromContext userIdProvider,
            CancellationToken cancellationToken,
            ICommandHandler<CreateMealCommand> handler,
            CancellationToken ct,
            [FromBody] Meal meal) =>
        {
            if (meal == null)
            {
                context.Response.StatusCode = 400;
                return;
            }
            var errors = meal.GetValidationErros();
            if (errors.Any())
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(errors);
                return;
            }
            await handler.HandleAsync(new CreateMealCommand(userIdProvider.GetUserId(), meal), ct);
            context.Response.StatusCode = 201;
        });

        return endpoints;
    }
}

public record CreateMealCommand(Guid UserId, Meal Meal) : Domain.Shared.BuildingBlocks.ICommand;
internal class CreateMealCommandHandler : ICommandHandler<CreateMealCommand>
{
    private readonly MealsDbContext _dbContext;

    public CreateMealCommandHandler(MealsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task HandleAsync(CreateMealCommand command, CancellationToken ct)
    {
        _dbContext.Meals.Add(new UserMealDao(command.Meal, command.UserId));
        await _dbContext.SaveChangesAsync(ct);
    }
}

