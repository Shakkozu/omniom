using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authorization;
using Omniom.Domain.Auth;

namespace Omniom.Domain.Shared.Extensions;

public static class EndpointRouteExtensions
{
    public static IEndpointConventionBuilder RequireAdministratorRole(this IEndpointConventionBuilder endpoint)
    {
        return endpoint.RequireAuthorization(new AuthorizeAttribute { Roles = AuthorizationRoles.Administrator });
    }
}
