using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Luna.Domain.Entities;

namespace Luna.Infrastructure.Persistence.Configurations;

public class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.ToTable("Sessions");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.ExpiresAt).IsRequired().HasColumnName("expires_at");

        builder.Property(s => s.Token).IsRequired().HasColumnName("token");
        builder.HasIndex(s => s.Token).IsUnique();

        builder.Property(s => s.CreatedAt).IsRequired().HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(s => s.UpdatedAt).IsRequired().HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.IpAddress).HasColumnName("ip_address");
        builder.Property(s => s.UserAgent).HasColumnName("user_agent");

        builder.Property(s => s.UserId).IsRequired().HasColumnName("user_id");
        builder.HasIndex(s => s.UserId);
        builder.HasIndex(s => s.ExpiresAt);

        // Relación con la tabla de usuarios
        builder.HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
