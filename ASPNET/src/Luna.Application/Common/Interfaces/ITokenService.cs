using System.Security.Claims;
using Luna.Domain.Enums;

namespace Luna.Application.Common.Interfaces;

public interface ITokenService
{
    (string accessToken, string refreshToken) GenerateTokens(Guid userId, string email, UserRole role);
    ClaimsPrincipal? ValidateAccessToken(string token);
    ClaimsPrincipal? ValidateRefreshToken(string token);
}
