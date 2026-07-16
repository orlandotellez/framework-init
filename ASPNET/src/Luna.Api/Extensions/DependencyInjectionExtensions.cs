using Luna.Api.Helpers;
using Luna.Application.Features.Auth;
using Luna.Application.Common.Interfaces.Repositories;
using Luna.Application.Common.Interfaces.Services;
using Luna.Infrastructure.Persistence.Repositories;
using Luna.Infrastructure.Services;

namespace Luna.Api.Extensions;

public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Helpers
        services.AddScoped<CookieHelper>();

        // Services Application
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ISessionRepository, SessionRepository>();


        // Services Infrastructure
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPasswordService, PasswordService>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
