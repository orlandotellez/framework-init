using Example.Domain.Entities;

namespace Example.Application.Common.Interfaces.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> CreateAsync(Product product);
    Task<Product> UpdateAsync(Product product);
    Task SoftDeleteAsync(Guid id, Guid deletedByUserId, string deletedByName);
}
