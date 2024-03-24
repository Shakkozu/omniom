using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Reflection.Emit;

namespace Omniom.Domain.NutritionDiary.Storage;

public class NutritionDiaryDbContext : DbContext
{
    public NutritionDiaryDbContext(DbContextOptions<NutritionDiaryDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var environmentName = Environment.GetEnvironmentVariable("EnvironmentName") ?? "Development";
        if (environmentName == "Development")
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
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                        v => v.ToUniversalTime(),
                        v => v.ToUniversalTime()));
                }
            }
        }
        modelBuilder.MapNutritionDiarySchema();
    }

    public DbSet<DiaryEntry> DiaryEntries { get; set; }
}

internal static class NutritionDiarySchema
{
    internal static void MapNutritionDiarySchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DiaryEntry>(entity =>
        {
            entity.ToTable("diary_entries");
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            entity.Property(e => e.Guid).HasColumnName("guid");
            entity.Property(e => e.DateTime).HasColumnName("date");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ProductName).HasColumnName("product_name");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Meal).HasColumnName("meal_type").HasConversion<string>();
            entity.Property(e => e.PortionInGrams).HasColumnName("portion_in_grams");
            entity.Property(e => e.Calories).HasColumnName("calories");
            entity.Property(e => e.Proteins).HasColumnName("protein");
            entity.Property(e => e.Carbohydrates).HasColumnName("carbohydrates");
            entity.Property(e => e.Sugars).HasColumnName("sugar");
            entity.Property(e => e.Fats).HasColumnName("fat");
            entity.Property(e => e.SaturatedFats).HasColumnName("saturated_fat");

            entity.HasIndex(e => e.Id).IsUnique();
            entity.HasIndex(e => e.Guid).IsUnique();
            entity.HasIndex(e => e.ProductId).IsUnique();
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.DateTime).IsUnique();
        });
    }
}
