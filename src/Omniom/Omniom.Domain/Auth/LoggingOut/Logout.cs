using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;


namespace Omniom.Domain.Auth.LoggingOut;

internal class Logout { }
internal static class Route
{
    internal static IEndpointRouteBuilder MapLogoutEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapPost("/api/accounts/logout", async (HttpContext context,
            ILogger<Logout> logger,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            [FromServices] IAntiforgery antiforgery) =>
        {
            try
            {
                await signInManager.SignOutAsync();

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during logout");
                return Results.StatusCode(500);
            }
        });
        return routeBuilder;
    }
}
