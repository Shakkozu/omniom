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
        var email = TestUserCredentials.Administrator(_configuration).Email;
        var password = TestUserCredentials.Administrator(_configuration).Password;

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
        var email = TestUserCredentials.User.Email;
        var password = TestUserCredentials.User.Password;
        await AssertThatUserIsRegistred(email, password);

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

    private async Task AssertThatUserIsRegistred(string email, string password)
    {
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
    }

    internal async Task<Guid> GetSuperuserIdAsync()
    {
        var email = TestUserCredentials.Administrator(_configuration).Email;
        var password = TestUserCredentials.Administrator(_configuration).Password;
        await AssertThatUserIsRegistred(email, password);
        var result = await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(TestUserCredentials.Administrator(_configuration).Email));
        return Guid.Parse(result);
    }

    internal async Task<Guid> GetUserIdAsync()
    {
        await AssertThatUserIsRegistred(TestUserCredentials.User.Email, TestUserCredentials.User.Password);
        var result = await _getUserIdByEmailQueryHandler.HandleAsync(new GetUserIdByEmailQuery(TestUserCredentials.User.Email));
        return Guid.Parse(result);
    }
}