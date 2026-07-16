namespace Luna.Domain.Entities;

public class Session
{
    public Guid Id { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string Token { get; set; } = string.Empty;   // Refresh token
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public Guid UserId { get; set; }                    // FK a User
    public User User { get; set; } = null!;
}
