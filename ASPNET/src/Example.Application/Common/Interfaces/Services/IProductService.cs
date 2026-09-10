using Example.Application.Common.DTO;

namespace Example.Application.Common.Interfaces.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(Guid currentUserId, CreateProductRequest request);
    Task<ProductDto> UpdateAsync(Guid currentUserId, Guid productId, UpdateProductRequest request);
    Task DeleteAsync(Guid currentUserId, Guid productId);
}
