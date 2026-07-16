using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Luna.Domain.Entities;

namespace Luna.Infrastructure.Persistence.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Account");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.AccountId).IsRequired().HasColumnName("account_id");
        builder.HasIndex(a => a.AccountId);

        builder.Property(a => a.ProviderId).IsRequired().HasColumnName("provider_id");
        builder.HasIndex(a => a.ProviderId);
        builder.HasIndex(a => new { a.ProviderId, a.AccountId }).IsUnique();

        builder.Property(a => a.UserId).IsRequired().HasColumnName("user_id");
        builder.HasIndex(a => a.UserId);
        // Relación con la tabla de usuarios
        builder.HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(a => a.AccessToken).HasColumnName("access_token");

        builder.Property(a => a.RefreshToken).HasColumnName("refresh_token");

        builder.Property(a => a.IdToken).HasColumnName("id_token");

        builder.Property(a => a.AccessTokenExpiresAt).HasColumnName("access_token_expires_at");
        builder.Property(a => a.RefreshTokenExpiresAt).HasColumnName("refresh_token_expires_at");

        builder.Property(a => a.Scope).HasColumnName("scope");

        builder.Property(a => a.Password).HasColumnName("password");

        builder.Property(a => a.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("created_at");
        builder.Property(a => a.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("updated_at");
    }
}
