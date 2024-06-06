using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

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

public class RegisterUserCommandHandler
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