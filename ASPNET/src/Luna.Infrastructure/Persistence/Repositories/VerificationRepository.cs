using Luna.Application.Common.Interfaces;
using Luna.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luna.Infrastructure.Persistence.Repositories;

public class VerificationRepository : IVerificationRepository
{
    private readonly ApplicationDbContext _context;

    public VerificationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Verification> CreateAsync(Verification verification)
    {
        await _context.Verifications.AddAsync(verification);
        await _context.SaveChangesAsync();
        return verification;
    }

    public async Task<Verification?> GetByIdentifierAsync(string identifier)
    {
        return await _context.Verifications
            .Where(v => v.Identifier == identifier && v.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(v => v.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<Verification?> GetByIdentifierAndValueAsync(string identifier, string value)
    {
        return await _context.Verifications
            .Where(v => v.Identifier == identifier && v.Value == value && v.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(v => v.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var verification = await _context.Verifications.FindAsync(id);
        if (verification != null)
        {
            _context.Verifications.Remove(verification);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByIdentifierAsync(string identifier)
    {
        var verifications = await _context.Verifications
            .Where(v => v.Identifier == identifier)
            .ToListAsync();

        _context.Verifications.RemoveRange(verifications);
        await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteExpiredAsync()
    {
        var expired = await _context.Verifications
            .Where(v => v.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        int count = expired.Count;
        _context.Verifications.RemoveRange(expired);
        await _context.SaveChangesAsync();
        return count;
    }
}
