using System.Security.Claims;
using Luna.Application.Common.Interfaces.Services;
using Luna.Application.Common.Interfaces.Repositories;
using Luna.Application.Common.Models;
using Luna.Application.Common.Mapping;
using Luna.Domain.Exceptions;
using Luna.Domain.Entities;
using Luna.Domain.Enums;

namespace Luna.Application.Features.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ISessionRepository _sessionRepository;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthService(
        IUserRepository userRepository,
        IAccountRepository accountRepository,
        ISessionRepository sessionRepository,
        IPasswordService passwordService,
        ITokenService tokenService
        )
    {
        _userRepository = userRepository;
        _accountRepository = accountRepository;
        _sessionRepository = sessionRepository;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Verify email
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null) throw AppExceptions.Conflict("Email already registered");

        // Hash password 
        var hashedPassword = _passwordService.HashPassword(request.Password);

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Role = UserRole.User,
            IsActive = true,
            EmailVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        // create credentials account
        var account = new Account
        {
            Id = Guid.NewGuid(),
            AccountId = user.Id.ToString(),
            ProviderId = "credentials",
            UserId = user.Id,
            Password = hashedPassword,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _accountRepository.CreateAsync(account);

        // Generater token JWT
        var (accessToken, refreshToken) = _tokenService.GenerateTokens(user.Id, user.Email, user.Role);

        // Create session
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _sessionRepository.CreateAsync(session);

        var response = new AuthResponse
        {
            Message = "User created sucessfully. Please veriry your email",
            User = user.MapUserToDto(),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };

        return response;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Search credentials
        var account = await _accountRepository.GetCredentialsByEmailAsync(request.Email);
        if (account == null) throw AppExceptions.Unauthorized("Invalid crednetials");

        // Verify Password 
        if (account.Password == null || !_passwordService.VerifyPassword(request.Password, account.Password)) throw AppExceptions.Unauthorized("Invalid credentials");

        // Get User 
        var user = await _userRepository.GetByIdAsync(account.UserId);
        if (user == null) throw AppExceptions.Unauthorized("User not found");


        if (user.DeletedAt != null) throw AppExceptions.Unauthorized("Account has been deactivated");

        // Generate tokens
        var (accessToken, refreshToken) = _tokenService.GenerateTokens(user.Id, user.Email, user.Role);

        // Create session 
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _sessionRepository.CreateAsync(session);

        var response = new AuthResponse
        {
            Message = "Login successful",
            User = user.MapUserToDto(),
            AccessToken = accessToken,
            RefreshToken = refreshToken

        };

        return response;
    }

    public async Task<RefreshResponse> RefreshAsync(string refreshToken)
    {
        // Validate refreshToken
        var principal = _tokenService.ValidateRefreshToken(refreshToken);
        if (principal == null)
            throw AppExceptions.Unauthorized("Invalid or expired refresh token");

        // Extract UserId from token
        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            throw AppExceptions.Unauthorized("Invalid refresh token");

        // Search active session with refreshToken
        var existingSession = await _sessionRepository.GetByTokenAsync(refreshToken);
        if (existingSession == null)
            throw AppExceptions.Unauthorized("Session not found");

        // Veriry expiry session
        if (existingSession.ExpiresAt < DateTime.UtcNow)
            throw AppExceptions.Unauthorized("Session expired");

        // Search user 
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || user.DeletedAt != null)
            throw AppExceptions.Unauthorized("User not found or deactivated");

        // Generate new Tokens(rotation)
        var (newAccessToken, newRefreshToken) = _tokenService.GenerateTokens(user.Id, user.Email, user.Role);

        // delete old session
        await _sessionRepository.DeleteAsync(refreshToken);

        // Create new session
        var newSession = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await _sessionRepository.CreateAsync(newSession);

        return new RefreshResponse
        {
            Message = "Tokens refreshed successfully",
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

    public async Task LogoutAsync(string refreshToken)
    {
        await _sessionRepository.DeleteAsync(refreshToken);
    }

}
