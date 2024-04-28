using Microsoft.Extensions.Configuration;

namespace Omniom.Tests.Auth;

internal record UserCredentials(string Email, string Password)
{
    internal static UserCredentials User => new UserCredentials("test_user@example.com", "Test123!");
    internal static UserCredentials Administrator(IConfiguration configuration) =>
        new UserCredentials(
            configuration["Administrator:Email"],
            configuration["Administrator:Password"]
            );
}

