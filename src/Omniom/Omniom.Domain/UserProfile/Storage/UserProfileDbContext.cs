using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Omniom.Domain.UserProfile.CustomizingAvailableMeals;

namespace Omniom.Domain.UserProfile.Storage;

internal class UserProfileDbContext : DbContext
{
    internal DbSet<UserProfileConfiguration> UserProfileConfigurations { get; set; }

    public UserProfileDbContext(DbContextOptions<UserProfileDbContext> options) : base(options)
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
        modelBuilder.MapUserProfileSchema();
    }
}

internal static class UserProfileSchema
{
    internal static void MapUserProfileSchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfileConfiguration>(entity =>
        {
            entity.ToTable("user_profile_configuration");
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Guid).HasColumnName("guid");
            entity.Property(e => e.MealsConfiguration).HasColumnName("meals_configuration")
            .HasConversion
            (
                configuration => JsonConvert.SerializeObject(configuration),
                jsonString => string.IsNullOrEmpty(jsonString)
                    ? new List<MealConfigurationItem>()
                    : JsonConvert.DeserializeObject<List<MealConfigurationItem>>(jsonString)
                );
        });
    }
}
