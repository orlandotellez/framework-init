using Example.Domain.Enums;

namespace Example.Application.Common.DTO;

public record CreateUserRequest(
    string Name,
    string Email,
    string Password,
    UserRole Role,
    string? Phone = null
);

public record UpdateUserRequest(
    string? Name,
    string? Email,
    UserRole? Role,
    string? Phone,
    string? Bio,
    string? UserName,
    bool? IsActive
);

public record UserFilter(
    string? Search,
    UserRole? Role,
    bool? IsActive,
    bool? IncludeDeleted
);
