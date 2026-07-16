namespace Luna.Application.Common.Models;

public record AuthResponse
{
    public string Message { get; init; } = string.Empty;
    public UserDto? User { get; init; }
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;

}


public record RefreshResponse
{
    public string Message { get; init; } = string.Empty;
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
}

public record ForgotPasswordResponse
{
    public string Message { get; init; } = string.Empty;
    public DateTime ExpiresAt { get; init; }
}

public record ResetPasswordResponse
{
    public string Message { get; init; } = string.Empty;
}
