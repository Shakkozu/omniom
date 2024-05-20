using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Omniom.Domain.Catalogue.Meals.Storage;
internal class MealsDbContext : DbContext
{
    public MealsDbContext(DbContextOptions<MealsDbContext> options)
        : base(options)
    {
    }

    internal DbSet<UserMealDao> Meals { get; set; }

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
        modelBuilder.MapMealsSchema();
    }
}

internal static class MealsSchema
{
    internal static void MapMealsSchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserMealDao>(entity =>
        {
            entity.ToTable("user_meals");
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.OwnsOne(e => e.Meal, meal =>
            {
                meal.Property(x => x.Guid).HasColumnName("guid");
                meal.Property(x => x.Name).HasColumnName("name");
                meal.Property(x => x.Description).HasColumnName("description");
                meal.Property(x => x.Recipe).HasColumnName("recipe");
                meal.Property(x => x.Portions).HasColumnName("portions");
                meal.Property(x => x.Ingredients).HasColumnName("ingredients")
                .HasConversion
            (
                ingredients => JsonConvert.SerializeObject(ingredients),
                jsonString => string.IsNullOrEmpty(jsonString)
                    ? new List<MealIngredient>()
                    : JsonConvert.DeserializeObject<List<MealIngredient>>(jsonString) ?? new List<MealIngredient>()
                );
            });
        });
    }
}
