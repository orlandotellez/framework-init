using Example.Api.Helpers;
using Example.Application.Features.Auth;
using Example.Application.Features.Products;
using Example.Application.Common.Interfaces.Repositories;
using Example.Application.Common.Interfaces.Services;
using Example.Infrastructure.Persistence.Repositories;
using Example.Infrastructure.Services;

namespace Example.Api.Extensions;

public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Helpers
        services.AddScoped<CookieHelper>();

        // Services Application
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ISessionRepository, SessionRepository>();


        // Services Infrastructure
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPasswordService, PasswordService>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();

        return services;
    }
}
