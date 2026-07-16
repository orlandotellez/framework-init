namespace Luna.Application.Common.Models;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password);
public record RefreshRequest(string RefreshToken);
public record VerifyEmailRequest(string Identifier, string Code);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Code, string NewPassword);
public record ResendVerificactionRequest(string Email);
public record UpdateMyProfileRequest(string? Name, string? Bio, string? Phone, string? Username, string? Image);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
