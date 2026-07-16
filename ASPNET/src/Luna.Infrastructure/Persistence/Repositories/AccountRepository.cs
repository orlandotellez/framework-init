using Luna.Application.Common.Interfaces;
using Luna.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luna.Infrastructure.Persistence.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly ApplicationDbContext _context;

    public AccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Account> CreateAsync(Account account)
    {
        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task DeleteAsync(Guid id)
    {
        var account = await _context.Accounts.FindAsync(id);
        if (account != null)
        {
            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByUserIdAsync(Guid userId)
    {
        var entityAccounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
        _context.Accounts.RemoveRange(entityAccounts);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Account>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
    }

    public async Task<Account?> GetByProviderAndAccountIdAsync(string providerId, string accountId)
    {
        return await _context.Accounts.FirstOrDefaultAsync(a => a.ProviderId == providerId && a.AccountId == accountId);
    }

    public async Task<Account?> GetCredentialsByEmailAsync(string email)
    {
        return await _context.Accounts
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.ProviderId == "credentials" && a.User.Email == email);
    }

    public async Task<Account?> GetCredentialsByUserIdAsync(Guid userId)
    {
        return await _context.Accounts
            .FirstOrDefaultAsync(a => a.ProviderId == "credentials" && a.UserId == userId);
    }
}
