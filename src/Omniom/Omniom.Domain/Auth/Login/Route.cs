using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Omniom.Domain.Auth.Login;

internal static class Route
{
    internal static IEndpointRouteBuilder MapLoginEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapPost("/api/accounts/login", async context =>
        {
            var command = await context.Request.ReadFromJsonAsync<LoginUserDto>();
            var handler = context.RequestServices.GetRequiredService<LoginUserCommandHandler>();
            var result = await handler.HandleAsync(command, context.RequestAborted);
            if (result.Success)
            {
                await context.Response.WriteAsJsonAsync(result);
            }
            else
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(result);
            }
        }); 
        return routeBuilder;
    }
}