namespace Example.Application.Common.DTO;

public record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    int Stock
);

public record UpdateProductRequest(
    string? Name,
    string? Description,
    decimal? Price,
    int? Stock
);
