using Example.Application.Common.Interfaces.Repositories;
using Example.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Example.Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products
            .Where(p => p.DeletedAt == null)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task SoftDeleteAsync(Guid id, Guid deletedByUserId, string deletedByName)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is not null)
        {
            product.DeletedAt = DateTime.UtcNow;
            product.DeletedByUserId = deletedByUserId;
            product.DeletedByName = deletedByName;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
