using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Omniom.Domain.ProductsCatalogue.AddProducts;
using System.Runtime.CompilerServices;


namespace Omniom.Domain.ProductsCatalogue.Storage;
public class ProductsCatalogueDbContext : DbContext
{
    public ProductsCatalogueDbContext(DbContextOptions<ProductsCatalogueDbContext> options)
        : base(options)
    {
        
    }

    internal DbSet<ProductData> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var environmentName = Environment.GetEnvironmentVariable("EnvironmentName") ?? "Development";
        if(environmentName == "Development")
        {
            optionsBuilder.LogTo(Console.WriteLine)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors();
        }

        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.MapProductsCatalogueSchema();
    }
}

internal static class ProductsCatalogueSchema
{
    internal static void MapProductsCatalogueSchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductData>(entity =>
        {
            entity.ToTable("products_data");

            entity.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            entity.Property(e => e.Guid).HasColumnName("guid");
            entity.Property(e => e.Code).HasColumnName("code");

            entity.HasIndex(e => e.Id).IsUnique();
            entity.HasIndex(e => e.Guid).IsUnique();
            entity.HasIndex(e => e.Code).IsUnique();

            entity.Property(e => e.ProductNamePl).HasColumnName("product_name_pl").IsRequired();
            entity.Property(e => e.GenericNamePl).HasColumnName("generic_name_pl");
            entity.Property(e => e.QuantityG).HasColumnName("quantity_g");
            entity.Property(e => e.ServingSizeG).HasColumnName("serving_size_g");
            entity.Property(e => e.Brands).HasColumnName("brands");
            entity.Property(e => e.Categories).HasColumnName("categories");
            entity.Property(e => e.CategoriesTags).HasColumnName("categories_tags");
            entity.Property(e => e.EnergyKcal).HasColumnName("energy_kcal");
            entity.Property(e => e.FatValueG).HasColumnName("fat_value_g");
            entity.Property(e => e.SaturatedFatValueG).HasColumnName("saturated_fat_value_g");
            entity.Property(e => e.CarbohydratesValueG).HasColumnName("carbohydrates_value_g");
            entity.Property(e => e.SugarsValueG).HasColumnName("sugars_value_g");
            entity.Property(e => e.FiberValueG).HasColumnName("fiber_value_g");
            entity.Property(e => e.ProteinsValueG).HasColumnName("proteins_value_g");
            entity.Property(e => e.SaltValueG).HasColumnName("salt_value_g");
        });
    }
}
