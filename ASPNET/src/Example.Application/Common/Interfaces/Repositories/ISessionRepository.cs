using Example.Domain.Entities;

namespace Example.Application.Common.Interfaces.Repositories;

public interface ISessionRepository
{
    Task<Session> CreateAsync(Session session);
    Task<Session?> GetByTokenAsync(string token);
    Task<List<Session>> GetByUserIdAsync(Guid userId);
    Task DeleteAsync(string token);
    Task DeleteByUserIdAsync(Guid userId);
    Task<int> DeleteExpiredAsync();
}
