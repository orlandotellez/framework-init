namespace Luna.Api.Helpers;

public class CookieHelper
{
    private readonly IWebHostEnvironment _environment;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CookieHelper(
        IWebHostEnvironment environment,
        IHttpContextAccessor httpContextAccesor
        )
    {
        _environment = environment;
        _httpContextAccessor = httpContextAccesor;

    }

    public void SetAuthCookies(string accessToken, string refreshToken)
    {
        // Obtenemos el objeto Response de manera segura a través del HttpContext 
        var response = _httpContextAccessor.HttpContext?.Response;
        if (response == null) return;

        bool isProduction = _environment.IsProduction();

        var accessTokenOptions = new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(15)
        };

        var refreshTokenOptions = new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        };

        response.Cookies.Append("accessToken", accessToken, accessTokenOptions);
        response.Cookies.Append("refreshToken", refreshToken, refreshTokenOptions);
    }

    public void ClearAuthCookies()
    {
        var response = _httpContextAccessor.HttpContext?.Response;
        if (response == null) return;

        var cookieOptions = new CookieOptions
        {
            Path = "/"
        };

        response.Cookies.Delete("accessToken", cookieOptions);
        response.Cookies.Delete("refreshToken", cookieOptions);
    }
}
