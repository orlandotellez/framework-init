using System.Security.Claims;
using Example.Domain.Enums;
using Example.Domain.Exceptions;

namespace Example.Api.Helpers;

public static class AuthHelper
{
    public static Guid? GetCurrentUserId(this HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null && Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    public static UserRole GetCurrentUserRole(this HttpContext httpContext)
    {
        var roleClaim = httpContext.User.FindFirst(ClaimTypes.Role)?.Value
            ?? throw AppExceptions.Unauthorized("User role claim is missing");

        if (!Enum.TryParse<UserRole>(roleClaim, out var role))
            throw AppExceptions.Unauthorized($"Invalid user role: {roleClaim}");

        return role;
    }

    public static UserRole? GetCurrentUserRoleOrDefault(this HttpContext httpContext)
    {
        var roleClaim = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        if (roleClaim == null) return null;

        if (!Enum.TryParse<UserRole>(roleClaim, out var role))
            throw AppExceptions.Unauthorized($"Invalid user role: {roleClaim}");

        return role;
    }
}
