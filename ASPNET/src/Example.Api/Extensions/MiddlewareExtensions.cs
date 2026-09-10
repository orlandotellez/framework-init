using Example.Api.Middleware;
using Example.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Example.Api.Extensions;

public static class MiddlewareExtensions
{
    public static async Task<WebApplication> ConfigureMiddlewareAsync(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Aplica migraciones pendientes (crea las tablas si no existen)
            await context.Database.MigrateAsync();

        }

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseCors();

        app.UseResponseCaching();

        app.UseMiddleware<ErrorHandlingMiddleware>();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.MapGet("/health", () => "ok");

        return app;
    }
}
