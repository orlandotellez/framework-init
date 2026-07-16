using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Luna.Domain.Entities;
using Luna.Domain.Enums;

namespace Luna.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(u => u.Name).IsRequired().HasColumnName("name").HasMaxLength(255);
        builder.Property(u => u.Email).IsRequired().HasColumnName("email").HasMaxLength(255);
        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.EmailVerified).HasColumnName("email_verified").IsRequired().HasDefaultValue(false);

        builder.Property(u => u.Phone).HasColumnName("phone");

        builder.Property(u => u.Image).HasColumnName("image");

        builder.Property(u => u.Role).HasColumnName("role").IsRequired().HasDefaultValue(UserRole.User);

        builder.Property(u => u.UserName).HasColumnName("username").HasMaxLength(50);
        builder.HasIndex(u => u.UserName).IsUnique();

        builder.Property(u => u.Bio).HasColumnName("bio");


        builder.Property(u => u.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(u => u.LastSeenAt).HasColumnName("last_seen_at");

        builder.HasIndex(u => u.Role);
        builder.HasIndex(u => u.CreatedAt).HasDatabaseName("idx_users_created_at");

        builder.Property(u => u.CreatedAt).IsRequired().HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(u => u.UpdatedAt).IsRequired().HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(u => u.DeletedAt).HasColumnName("deleted_at");
        builder.Property(u => u.DeletedByUserId).HasColumnName("deleted_by_user_id");
        builder.Property(u => u.DeletedByName).HasColumnName("deleted_by_name").HasMaxLength(255);

    }
}
