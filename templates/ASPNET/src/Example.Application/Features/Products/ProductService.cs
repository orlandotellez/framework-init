using Example.Application.Common.DTO;
using Example.Application.Common.Interfaces.Repositories;
using Example.Application.Common.Interfaces.Services;
using Example.Application.Common.Mapping;
using Example.Domain.Entities;
using Example.Domain.Exceptions;

namespace Example.Application.Features.Products;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;

    public ProductService(IProductRepository productRepository, IUserRepository userRepository)
    {
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public async Task<ProductDto> CreateAsync(Guid currentUserId, CreateProductRequest request)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        var created = await _productRepository.CreateAsync(product);
        return created.MapProductToDto();
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(p => p.MapProductToDto()).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product?.MapProductToDto();
    }

    public async Task<ProductDto> UpdateAsync(Guid currentUserId, Guid productId, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null) throw AppExceptions.NotFound("Product not found");

        if (request.Name is not null) product.Name = request.Name;
        if (request.Description is not null) product.Description = request.Description;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.Stock.HasValue) product.Stock = request.Stock.Value;
        product.UpdatedAt = DateTime.UtcNow;

        var updated = await _productRepository.UpdateAsync(product);
        return updated.MapProductToDto();
    }

    public async Task DeleteAsync(Guid currentUserId, Guid productId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null) throw AppExceptions.NotFound("Product not found");

        var user = await _userRepository.GetByIdAsync(currentUserId);
        var deletedByName = user?.Name ?? "Unknown";

        await _productRepository.SoftDeleteAsync(productId, currentUserId, deletedByName);
    }
}
