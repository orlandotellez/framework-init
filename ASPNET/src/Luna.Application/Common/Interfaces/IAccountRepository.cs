using Luna.Domain.Entities;

namespace Luna.Application.Common.Interfaces;

public interface IAccountRepository
{
    Task<Account?> GetByProviderAndAccountIdAsync(string providerId, string accountId);
    Task<List<Account>> GetByUserIdAsync(Guid userId);
    Task<Account?> GetCredentialsByEmailAsync(string email);
    Task<Account?> GetCredentialsByUserIdAsync(Guid userId);
    Task<Account> CreateAsync(Account account);
    Task<Account> UpdateAsync(Account account);
    Task DeleteAsync(Guid id);
    Task DeleteByUserIdAsync(Guid userId);
}
