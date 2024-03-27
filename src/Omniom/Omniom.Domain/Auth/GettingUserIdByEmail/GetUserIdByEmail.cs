using Microsoft.AspNetCore.Identity;

namespace Omniom.Domain.Auth.GetUserIdByEmail;
public record GetUserIdByEmailQuery(string Email);

public class GetUserIdByEmailHandlerQueryHandler
{
    private readonly UserManager<IdentityUser> _userManager;

    public GetUserIdByEmailHandlerQueryHandler(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<string> HandleAsync(GetUserIdByEmailQuery query)
    {
        var user = await _userManager.FindByEmailAsync(query.Email);
        if (user == null)
        {
            throw new InvalidOperationException("User with email not found ");
        }

        return user.Id;
    }
}