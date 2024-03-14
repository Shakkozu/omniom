﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omniom.Domain.Auth.RegisterUser;
public record UserForRegistrationDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
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
            Email = userForRegistrationDto.Email
        };

        var result = await _userManager.CreateAsync(user, userForRegistrationDto.Password);

        if (result.Succeeded)
        {
            return new RegistrationResponseDto(true, null);
        }

        return new RegistrationResponseDto(false, result.Errors.Select(e => e.Description));
    }
}



internal static class Route
{
    internal static IEndpointRouteBuilder MapRegisterUserEndpoint(this IEndpointRouteBuilder routeBuilder)
    {
        routeBuilder.MapPost("account/register", async context =>
        {
            var command = await context.Request.ReadFromJsonAsync<UserForRegistrationDto>();
            var handler = context.RequestServices.GetRequiredService<RegisterUserCommandHandler>();
            var response = await handler.HandleAsync(command!, context.RequestAborted);
            await context.Response.WriteAsJsonAsync(response);
        }); 
        return routeBuilder;
    }
}