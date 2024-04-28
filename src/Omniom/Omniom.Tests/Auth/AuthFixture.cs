using Microsoft.Extensions.Configuration;
using Omniom.Domain.Auth.GetUserIdByEmail;
using Omniom.Domain.Auth.Login;
using Omniom.Domain.Auth.RegisterUser;

namespace Omniom.Tests.Auth;

public class AuthFixture
{
    private readonly LoginUserCommandHandler _loginUserCommandHandler;
    private readonly RegisterUserCommandHandler _registerUserCommandHandler;
    private readonly GetUserIdByEmailHandlerQueryHandler _getUserIdByEmailQueryHandler;
    private readonly IConfiguration _configuration;

    public AuthFixture(LoginUserCommandHandler loginUserCommandHandler,
        RegisterUserCommandHandler registerUserCommandHandler,
        GetUserIdByEmailHandlerQueryHandler getUserIdByEmailQueryHandler,
        IConfiguration configuration)
    {
        _loginUserCommandHandler = loginUserCommandHandler;
        _registerUserCommandHandler = registerUserCommandHandler;
        _getUserIdByEmailQueryHandler = getUserIdByEmailQueryHandler;
        _configuration = configuration;
    }

    internal async Task<string> GetAuthenticationTokenForSuperUserAsync()
    {
        var email = UserCredentials.Administrator(_configuration).Email;
        var password = UserCredentials.Administrator(_configuration).Password;

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
    
    internal async Task<string> GetAuthenticationTokenForUserAsync()
    {
        var email = UserCredentials.User.Email;
        var password = UserCredentials.User.Password;
        var userAlreadyExists = false;
        try
        {
            userAlreadyExists = !string.IsNullOrEmpty(await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(email)));
        }
        catch { }

        if (!userAlreadyExists)
        {

            var dto = new UserForRegistrationDto { Email = email, Password = password, ConfirmPassword = password };
            await _registerUserCommandHandler.HandleAsync(dto, CancellationToken.None);
        }

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
        var result = await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(UserCredentials.Administrator(_configuration).Email));
        return Guid.Parse(result);
    }
    internal async Task<Guid> GetUserIdAsync()
    {
        var result = await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(UserCredentials.User.Email));
        return Guid.Parse(result);
    }
}

