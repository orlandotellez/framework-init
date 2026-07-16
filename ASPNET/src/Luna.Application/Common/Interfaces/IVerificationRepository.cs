using Luna.Domain.Entities;

namespace Luna.Application.Common.Interfaces;

public interface IVerificationRepository
{
    Task<Verification> CreateAsync(Verification verification);
    Task<Verification?> GetByIdentifierAsync(string identifier);
    Task<Verification?> GetByIdentifierAndValueAsync(string identifier, string value);
    Task DeleteAsync(Guid id);
    Task DeleteByIdentifierAsync(string identifier);
    Task<int> DeleteExpiredAsync();
}
