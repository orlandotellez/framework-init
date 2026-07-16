namespace Luna.Domain.Entities;

public class Account
{
    public Guid Id { get; set; }
    public string AccountId { get; set; } = null!;      // ID del proveedor
    public string ProviderId { get; set; } = null!;     // Proveedor: "credentials", "google", "github"
    public Guid UserId { get; set; }                    // FK a User
    public User User { get; set; } = null!;             // Navigation property
    public string? AccessToken { get; set; }            // OAuth access token
    public string? RefreshToken { get; set; }           // OAuth refresh token
    public string? IdToken { get; set; }                // OAuth ID token
    public DateTime? AccessTokenExpiresAt { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }
    public string? Scope { get; set; }
    public string? Password { get; set; }               // Password hasheado (credentials)
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
