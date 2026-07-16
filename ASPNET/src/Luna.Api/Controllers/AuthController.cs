using Luna.Application.Common.Interfaces.Services;
using Luna.Application.Common.Models;
using Luna.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Luna.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly CookieHelper _cookieHelper;

    public AuthController(
        IAuthService authService,
        CookieHelper cookieHelper
        )
    {
        _authService = authService;
        _cookieHelper = cookieHelper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        if (currentUserId.HasValue)
        {
            return Conflict("Already loggend in. Please logout before creating a new account.");
        }

        var result = await _authService.RegisterAsync(request);

        _cookieHelper.SetAuthCookies(result.AccessToken, result.RefreshToken);

        return CreatedAtAction(null, new
        {
            message = result.Message,
            user = result.User
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var result = await _authService.LoginAsync(request);

        if (currentUserId.HasValue && currentUserId != result.User?.Id)
        {
            _cookieHelper.ClearAuthCookies();
        }

        _cookieHelper.SetAuthCookies(result.AccessToken, result.RefreshToken);

        return Ok(new
        {
            message = result.Message,
            user = result.User
        });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<RefreshResponse>> Refresh([FromBody] RefreshRequest? request = null)
    {
        var refreshToken = Request.Cookies["refreshToken"] ?? string.Empty;
        if (string.IsNullOrEmpty(refreshToken))
            return BadRequest(new { error = "Refresh token is required" });

        var result = await _authService.RefreshAsync(refreshToken);

        _cookieHelper.SetAuthCookies(result.AccessToken, result.RefreshToken);

        return Ok(result);
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"] ?? string.Empty;
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.LogoutAsync(refreshToken);
        }
        _cookieHelper.ClearAuthCookies();
        return Ok(new { message = "Logged out successfully" });
    }
}
