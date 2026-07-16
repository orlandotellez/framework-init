using System.Text.Json.Serialization;
using Luna.Api.Extensions;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Extensiones configurables
builder.Services.AddRateLimiterConfiguration();
builder.Services.AddCorsConfiguration(builder.Configuration);
builder.Services.AddDatabaseConfiguration(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);


var app = builder.Build();

await app.ConfigureMiddlewareAsync();

app.Run();


