using System.Net;
using System.Text.Json;
using Luna.Domain.Exceptions;

namespace Luna.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    // Método que se ejecutará por cada petición Http
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Si algo sale mal, el logger se encargará de capturarlo
            _logger.LogError(ex, "Ocurrió un error no controlado en la ruta {Path}", context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }
    // Método estático que evalúa que tipo de error fué (404, 500, etc)
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Aquí asignamos el código Http (404, 500, etc)
        context.Response.StatusCode = exception switch
        {
            AppException appEx => appEx.StatusCode,
            _ => (int)HttpStatusCode.InternalServerError
        };

        // ProblemDetails (RFC 7807) con código de error custom
        object responseObj;
        if (exception is AppException appException)
        {
            responseObj = new
            {
                type = "https://tools.ietf.org/html/rfc7807",
                title = appException.StatusCode switch
                {
                    400 => "Bad Request",
                    401 => "Unauthorized",
                    403 => "Forbidden",
                    404 => "Not Found",
                    409 => "Conflict",
                    422 => "Unprocessable Entity",
                    _ => "Error"
                },
                status = appException.StatusCode,
                detail = appException.Message,
                code = appException.Code
            };
        }
        else
        {
            responseObj = new
            {
                type = "https://tools.ietf.org/html/rfc7807",
                title = "Internal Server Error",
                status = 500,
                detail = "An unexpected error occurred. Please try again later.",
                code = "internal.error"
            };
        }

        // Convertimos la respuesta en un JSON
        return context.Response.WriteAsync(JsonSerializer.Serialize(responseObj));
    }
}
