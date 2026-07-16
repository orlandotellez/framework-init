using Luna.Application.Common.Models;

namespace Luna.Application.Common.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<RefreshResponse> RefreshAsync(string refreshToken);
    Task LogoutAsync(string refreshToken);
    //Task<AuthResponse> VerifyEmailAsync(string identifier, string code);
    //Task ResendVerificationAsync(string email);
    //Task<ForgotPasswordResponse> ForgotPasswordAsync(string email);
    //Task<ResetPasswordResponse> ResetPasswordAsync(string email, string code, string newPassword);
    //Task<UserDto> UpdateMyProfileAsync(Guid userId, UpdateMyProfileRequest request);
    //Task<UserDto> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}
