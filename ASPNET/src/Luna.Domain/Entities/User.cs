using Luna.Domain.Enums;

namespace Luna.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool EmailVerified { get; set; }
    public string? Phone { get; set; }
    public string? Image { get; set; }
    public UserRole Role { get; set; }
    public string? UserName { get; set; }
    public string? Bio { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; } // soft Delete
    public Guid? DeletedByUserId { get; set; } // Quien eliminó
    public string? DeletedByName { get; set; } // Nombre de quien eliminó 
    public int FailedLoginAttempts { get; set; } // Intentos fallidos 
    public DateTime? LockoutEnd { get; set; } // Fin del bloqueo
}
