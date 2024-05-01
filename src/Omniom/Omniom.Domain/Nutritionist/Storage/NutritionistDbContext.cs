using Microsoft.EntityFrameworkCore;
using Omniom.Domain.Nutritionist.RegisteringUserAsNutritionist;

namespace Omniom.Domain.Nutritionist.Storage;
internal class NutritionistDbContext : DbContext
{
    public NutritionistDbContext(DbContextOptions<NutritionistDbContext> options) : base(options)
    {
    }

    public DbSet<NutritionistVerificationRequest> VerificationRequests { get; internal set; }
    public DbSet<Nutritionist> Nutritionists { get; internal set; }

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
        modelBuilder.MapNutritionistSchema();
    }
}

internal static class NutritionistSchema
{
    internal static void MapNutritionistSchema(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NutritionistVerificationRequest>(model =>
        {
            model.ToTable("nutritionist_verification_requests");
            model.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            model.Property(e => e.UserId).HasColumnName("user_id");
            model.Property(e => e.Guid).HasColumnName("guid");
            model.Property(e => e.CreatedAt).HasColumnName("created_at");
            model.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            model.Property(e => e.Status).HasColumnName("status");
            model.HasMany(e => e.Attachments).WithOne().HasForeignKey(e => e.RequestGuid)
            .HasPrincipalKey(p => p.Guid);

        });

        modelBuilder.Entity<NutritionistVerificationAttachment>(model =>
        {
            model.ToTable("nutritionist_verification_attachments");
            model.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            model.Property(e => e.RequestGuid).HasColumnName("request_guid");
            model.OwnsOne(e => e.Attachment, attachment =>
            {
                attachment.Property(x => x.FileName).HasColumnName("file_name");
                attachment.Property(x => x.FileContentBase64Encoded).HasColumnName("file_content");
            });
        });

        modelBuilder.Entity<Nutritionist>(model =>
        {
            model.ToTable("nutritionists");
            model.Property(e => e.Id).HasColumnName("id").UseIdentityColumn();
            model.Property(e => e.Guid).HasColumnName("guid");
            model.Property(e => e.UserId).HasColumnName("user_id");
            model.Property(e => e.FirstName).HasColumnName("first_name");
            model.Property(e => e.LastName).HasColumnName("last_name");
            model.Property(e => e.City).HasColumnName("city");
            model.Property(e => e.Email).HasColumnName("email");
            model.Property(e => e.TermsAndConditionsAccepted).HasColumnName("terms_and_conditions_accepted");
            model.Property(e => e.IsVerified).HasColumnName("is_verified");
            model.Property(e => e.CreatedAt).HasColumnName("created_at");
            model.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });
    }
}

internal class NutritionistVerificationRequest
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public Guid Guid { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Status { get; set; }

    public virtual List<NutritionistVerificationAttachment> Attachments { get; set; }
    public DateTime UpdatedAt { get; internal set; }
}

public class NutritionistVerificationAttachment
{
    public int Id { get; set; }
    public Guid RequestGuid { get; set; }
    public Attachment Attachment { get; set; }

}

public record Attachment(string FileName, string FileContentBase64Encoded);
