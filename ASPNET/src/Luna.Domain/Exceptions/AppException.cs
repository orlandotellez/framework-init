namespace Luna.Domain.Exceptions;

public class AppException : Exception
{
    public int StatusCode { get; }
    public string Code { get; }
    public bool IsOperational { get; }

    public AppException(string message, int statusCode, string code) : base(message)
    {
        StatusCode = statusCode;
        Code = code;
        IsOperational = true;
    }
}

public static class AppExceptions
{
    public static AppException BadRequest(string message = "Bad Request") => new(message, 400, "BAD_REQUEST");

    public static AppException Unauthorized(string message = "Unauthorized")
       => new(message, 401, "UNAUTHORIZED");

    public static AppException Forbidden(string message = "Forbidden")
        => new(message, 403, "FORBIDDEN");

    public static AppException NotFound(string message = "Not Found")
        => new(message, 404, "NOT_FOUND");

    public static AppException Conflict(string message = "Conflict")
        => new(message, 409, "CONFLICT");

    public static AppException UnprocessableEntity(string message = "Unprocessable Entity")
        => new(message, 422, "UNPROCESSABLE_ENTITY");

    public static AppException TooManyRequests(string message = "Too Many Requests")
        => new(message, 429, "TOO_MANY_REQUESTS");

    public static AppException InternalError(string message = "Internal Server Error")
        => new(message, 500, "INTERNAL_SERVER_ERROR");

}
