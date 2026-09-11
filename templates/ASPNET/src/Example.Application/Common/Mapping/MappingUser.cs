using Example.Application.Common.DTO;
using Example.Domain.Entities;
using Example.Domain.Exceptions;

namespace Example.Application.Common.Mapping;

public static class MappingUser
{
    public static UserDto MapUserToDto(this User user)
    {
        if (user == null) throw AppExceptions.UnprocessableEntity(nameof(user));

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            EmailVerified = user.EmailVerified,
            Phone = user.Phone,
            Image = user.Image,
            Role = user.Role,
            UserName = user.UserName,
            Bio = user.Bio,
            IsActive = user.IsActive,
            LastSeenAt = user.LastSeenAt,
            CreatedAt = user.CreatedAt,
            DeletedAt = user.DeletedAt,
            DeletedByUserId = user.DeletedByUserId,
            DeletedByName = user.DeletedByName,
        };
    }
}
