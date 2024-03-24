using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace Omniom.Domain.Auth.RegisterUser;

internal static class Route
{
    internal static IEndpointRouteBuilder MapRegisterUserEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapPost("/api/accounts/register", async context =>
        {
            var command = await context.Request.ReadFromJsonAsync<UserForRegistrationDto>();
            if(command.Password != command.ConfirmPassword)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsJsonAsync(new RegistrationResponseDto(false, new[] { "The password and confirmation password do not match." }));
                return;
            }

            var handler = context.RequestServices.GetRequiredService<RegisterUserCommandHandler>();
            var response = await handler.HandleAsync(command!, context.RequestAborted);
            if (!response.Success)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            await context.Response.WriteAsJsonAsync(response);
        }); 
        return routeBuilder;
    }
}