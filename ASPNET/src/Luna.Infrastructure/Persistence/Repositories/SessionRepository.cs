using Luna.Application.Common.Interfaces.Repositories;
using Luna.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luna.Infrastructure.Persistence.Repositories;

public class SessionRepository : ISessionRepository
{
    private readonly ApplicationDbContext _context;

    public SessionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Session> CreateAsync(Session session)
    {
        await _context.Sessions.AddAsync(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<Session?> GetByTokenAsync(string token)
    {
        return await _context.Sessions.FirstOrDefaultAsync(s => s.Token == token);
    }

    public async Task<List<Session>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Sessions.Where(s => s.UserId == userId).ToListAsync();
    }

    public async Task DeleteAsync(string token)
    {
        var session = await _context.Sessions.FirstOrDefaultAsync(s => s.Token == token);
        if (session != null)
        {
            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByUserIdAsync(Guid userId)
    {
        var userSessions = await _context.Sessions.Where(s => s.UserId == userId).ToListAsync();
        _context.Sessions.RemoveRange(userSessions);
        await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteExpiredAsync()
    {
        var expiredSessions = await _context.Sessions.Where(s => s.ExpiresAt < DateTime.UtcNow).ToListAsync();
        int count = expiredSessions.Count;
        _context.Sessions.RemoveRange(expiredSessions);
        await _context.SaveChangesAsync();
        return count;
    }
}
