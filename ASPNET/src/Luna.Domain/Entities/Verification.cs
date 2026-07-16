namespace Luna.Domain.Entities;

public class Verification
{
    public Guid Id { get; set; }
    public string Identifier { get; set; } = null!;     // Email o teléfono
    public string Value { get; set; } = null!;          // Código/token
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
