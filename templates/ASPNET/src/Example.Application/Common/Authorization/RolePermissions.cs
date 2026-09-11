using Example.Domain.Enums;

namespace Example.Application.Common.Authorization;

public static class RolePermissions
{
    private static readonly Dictionary<UserRole, HashSet<string>> RolePermissionsMap = new()
    {
        [UserRole.Admin] = new HashSet<string>
        {
            "products.read", "products.create", "products.update", "products.delete",
            "users.read", "users.update", "users.deactivate",
        },
        [UserRole.User] = new HashSet<string>
        {
            "products.read", "profile.read", "profile.update",
        },
        [UserRole.Familiar] = new HashSet<string>
        {
            "products.read", "profile.read", "profile.update",
        },
        [UserRole.Professional] = new HashSet<string>
        {
            "products.read", "profile.read", "profile.update",
        },
    };

    public static bool HasPermission(UserRole role, string permission)
    {
        if (!RolePermissionsMap.TryGetValue(role, out var permissions))
            return false;
        return permissions.Contains(permission);
    }

    public static bool HasAnyPermission(UserRole role, params string[] permissions)
        => permissions.Any(p => HasPermission(role, p));

    public static bool HasAllPermissions(UserRole role, params string[] permissions)
        => permissions.All(p => HasPermission(role, p));
}
