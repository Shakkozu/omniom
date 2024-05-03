using Omniom.DatabaseMigrator;
using Omniom.Domain;
using Omniom.Domain.Auth;
using Omniom.Domain.NutritionDiary;
using Omniom.Domain.ProductsCatalogue;
using Omniom.Domain.UserProfile;
using Omniom.Domain.Shared;
using Omniom.Domain.Nutritionist;

namespace Omniom.WebAPI;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var config = builder.Configuration;

        // Add services to the container.
        builder.Services.AddAuthorization();
        builder.Services.AddAntiforgery();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors();
        builder.Services.AddSharedBuildingBlocks();
        builder.Services.AddProductsCatalogue(config);
        builder.Services.AddAuthorizationModule(config);
        builder.Services.AddNutritionDiary(config);
        builder.Services.AddUserProfileModule(config);
        builder.Services.AddNutritionistModule(config);

        var app = builder.Build();
        var productsDbConnectionString = config.GetConnectionString("ProductsDatabase");
        var omniomDbConnectionString = config.GetConnectionString("OmniomDatabase");

        // Configure the HTTP request pipeline.
        if (app.Environment.IsEnvironment("Automated_Tests"))
            MigrationRunner.CleanupDatabase(productsDbConnectionString, omniomDbConnectionString);

        MigrationRunner.RunMigrations(productsDbConnectionString, omniomDbConnectionString);

        app.UseSwagger();
        app.UseSwaggerUI();

        if (!app.Environment.IsEnvironment("Automated_Tests"))
            app.InitializeProductsCatalogueDatabase();
        if (config.GetValue<bool>("Configuration:AddSuperuser"))
        {
            app.AddSuperuser(config).GetAwaiter().GetResult();
        }
        if (config.GetValue<bool>("Configuration:SeedApplicationStateWithData"))
        {
            app.AddNutritionDiaryEntries(config);
        }

        app.UseRouting();
        app.UseAntiforgery();

        app.UseCors(options =>
        {
            options.AllowAnyOrigin();
            options.AllowAnyMethod();
            options.AllowAnyHeader();
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapProductsCatalogueEndpoints();
        app.MapAuthenticationModuleEndpoints();
        app.MapNutritionDiaryEndpoints();
        app.MapUserProfileModuleEndpoints();
        app.MapNutritionistEndpoints();

        app.Run();
    }
}