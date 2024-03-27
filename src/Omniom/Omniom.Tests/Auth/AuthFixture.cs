using Microsoft.Extensions.Configuration;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.Login;

namespace Omniom.Tests.Auth;

public class AuthFixture
{
    private readonly LoginUserCommandHandler _loginUserCommandHandler;
    private readonly GetUserIdByEmailHandlerQueryHandler _getUserIdByEmailQueryHandler;
    private readonly IConfiguration _configuration;

    public AuthFixture(LoginUserCommandHandler loginUserCommandHandler,
        GetUserIdByEmailHandlerQueryHandler getUserIdByEmailQueryHandler,
        IConfiguration configuration)
    {
        _loginUserCommandHandler = loginUserCommandHandler;
        _getUserIdByEmailQueryHandler = getUserIdByEmailQueryHandler;
        _configuration = configuration;
    }

    internal async Task<string> GetAuthenticationTokenForSuperUserAsync()
    {
        var email = _configuration["Administrator:Email"];
        var password = _configuration["Administrator:Password"];
        var authenticationResult = await _loginUserCommandHandler.HandleAsync(new LoginUserDto
        {
            Email = email,
            Password = password
        }, CancellationToken.None);
        if (!authenticationResult.Success)
        {
            throw new Exception("Failed to authenticate user");
        }

        return authenticationResult.Token;
    }

    

    internal async Task<Guid> GetSuperuserIdAsync()
    {
        var email = _configuration["Administrator:Email"];
        var result = await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(email));
        return Guid.Parse(result);
    }



}
