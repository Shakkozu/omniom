using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Omniom.Domain.Auth.Storage;

public class AuthorizationDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<IdentityUser> Users { get; set; }

    public AuthorizationDbContext(DbContextOptions<AuthorizationDbContext> options) : base(options)
    {
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.MapAuthorizationSchema();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.EnableSensitiveDataLogging();
    }

}
internal static class AuthorizationContextSchema
{
    internal static void MapAuthorizationSchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityUser>(entity =>
        {
            entity.ToTable("users");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserName).HasColumnName("username").IsRequired();
            entity.Property(e => e.NormalizedUserName).HasColumnName("normalized_username").IsRequired();
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.NormalizedEmail).HasColumnName("normalized_email").IsRequired();
            entity.Property(e => e.EmailConfirmed).HasColumnName("email_confirmed").IsRequired();
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash").IsRequired();
            entity.Property(e => e.SecurityStamp).HasColumnName("security_stamp").IsRequired();
            entity.Property(e => e.ConcurrencyStamp).HasColumnName("concurrency_stamp").IsRequired();
            entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
            entity.Property(e => e.PhoneNumberConfirmed).HasColumnName("phone_number_confirmed").IsRequired();
            entity.Property(e => e.TwoFactorEnabled).HasColumnName("two_factor_enabled").IsRequired();
            entity.Property(e => e.LockoutEnd).HasColumnName("lockout_end");
            entity.Property(e => e.LockoutEnabled).HasColumnName("lockout_enabled");
            entity.Property(e => e.AccessFailedCount).HasColumnName("access_failed_count").IsRequired();
        });

        modelBuilder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable("roles");
            entity.Property(e => e.Id).HasColumnName("id").IsRequired();
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.Property(e => e.NormalizedName).HasColumnName("normalized_name").IsRequired();
        });

        modelBuilder.Entity<IdentityUserRole<string>>(entity =>
        {
            entity.ToTable("user_roles");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.RoleId).HasColumnName("role_id").IsRequired();
        });


        modelBuilder.Entity<IdentityUserClaim<string>>(entity =>
        {
            entity.ToTable("user_claims");
            entity.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.ClaimType).HasColumnName("claim_type").IsRequired();
            entity.Property(e => e.ClaimValue).HasColumnName("claim_value").IsRequired();
        });
    }
}
