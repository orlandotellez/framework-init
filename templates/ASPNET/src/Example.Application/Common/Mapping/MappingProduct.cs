using Example.Application.Common.DTO;
using Example.Domain.Entities;

namespace Example.Application.Common.Mapping;

public static class MappingProduct
{
    public static ProductDto MapProductToDto(this Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            DeletedAt = product.DeletedAt,
            DeletedByName = product.DeletedByName,
        };
    }
}
