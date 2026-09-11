using Example.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Example.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(p => p.Name).IsRequired().HasColumnName("name").HasMaxLength(255);
        builder.HasIndex(p => p.Name).IsUnique();
        builder.Property(p => p.Description).HasColumnName("description").HasMaxLength(2000);
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)").HasColumnName("price");
        builder.Property(p => p.Stock).HasColumnName("stock").HasDefaultValue(0);
        builder.Property(p => p.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.HasIndex(p => p.Price);
        builder.HasIndex(p => p.CreatedAt).HasDatabaseName("idx_products_created_at");
        builder.Property(p => p.CreatedAt).IsRequired().HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(p => p.UpdatedAt).IsRequired().HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");
        builder.Property(p => p.DeletedByUserId).HasColumnName("deleted_by_user_id");
        builder.Property(p => p.DeletedByName).HasColumnName("deleted_by_name").HasMaxLength(255);
    }
}
