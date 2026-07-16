using Microsoft.EntityFrameworkCore;
using Luna.Infrastructure.Persistence;

namespace Luna.Api.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabaseConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
          ?? throw new InvalidOperationException("DefaultConnection string is not configured. Set it in appsettings.json");

        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("Luna.Infrastructure")));

        return services;
    }
}
