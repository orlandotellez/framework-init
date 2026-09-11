using System.Security.Claims;
using Example.Domain.Enums;

namespace Example.Application.Common.Interfaces.Services;

public interface ITokenService
{
    (string accessToken, string refreshToken) GenerateTokens(Guid userId, string email, UserRole role);
    ClaimsPrincipal? ValidateAccessToken(string token);
    ClaimsPrincipal? ValidateRefreshToken(string token);
}
