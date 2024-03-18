using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.Auth.RegisterUser;
public record UserForRegistrationDto
{

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Incorrect email provided")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }

    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string? ConfirmPassword { get; set; }
}

public record RegistrationResponseDto(bool Success, IEnumerable<string>? Errors);

internal class RegisterUserCommandHandler
{
    private readonly UserManager<IdentityUser> _userManager;

    public RegisterUserCommandHandler(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<RegistrationResponseDto> HandleAsync(UserForRegistrationDto userForRegistrationDto, CancellationToken ct)
    {
        var user = new IdentityUser
        {
            UserName = userForRegistrationDto.Email,
            Email = userForRegistrationDto.Email,
        };

        var result = await _userManager.CreateAsync(user, userForRegistrationDto.Password);

        if (result.Succeeded)
        {
            return new RegistrationResponseDto(true, null);
        }

        return new RegistrationResponseDto(false, result.Errors.Select(e => e.Description).ToList());
    }
}



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