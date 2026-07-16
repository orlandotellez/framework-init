using Luna.Application.Common.Interfaces;
using Luna.Application.Common.Models;
using Luna.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luna.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync(UserFilter filter)
    {
        IQueryable<User> query = _context.Users.AsQueryable();

        if (filter.IncludeDeleted != true)
            query = query.Where(u => u.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search;
            query = query.Where(u =>
                EF.Functions.ILike(u.Name, $"%{search}%") ||
                EF.Functions.ILike(u.Email, $"%{search}%"));
        }

        if (filter.Role.HasValue)
            query = query.Where(u => u.Role == filter.Role.Value);

        if (filter.IsActive.HasValue)
            query = query.Where(u => u.IsActive == filter.IsActive.Value);

        return await query.OrderByDescending(u => u.CreatedAt).ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.DeletedAt == null);
    }

    public async Task<User> UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task SoftDeleteAsync(Guid id, Guid deletedByUserId, string deletedByName)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.DeletedAt = DateTime.UtcNow;
            user.DeletedByUserId = deletedByUserId;
            user.DeletedByName = deletedByName;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }


    public async Task RestoreAsync(Guid id)
    {
        var user = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Id == id);
        if (user != null)
        {
            user.DeletedAt = null;
            user.DeletedByUserId = null;
            user.DeletedByName = null;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }

}
