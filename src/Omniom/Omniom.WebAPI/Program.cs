using Omniom.DatabaseMigrator;
using Omniom.Domain.ProductsCatalogue;

namespace Omniom.WebAPI;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var config = builder.Configuration;

        // Add services to the container.
        builder.Services.AddAuthorization();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors();
        builder.Services.AddProductsCatalogue(config);

        var app = builder.Build();
        var productsDbConnectionString = config.GetConnectionString("ProductsDatabase");

        // Configure the HTTP request pipeline.
        if (app.Environment.IsEnvironment("Automated_Tests"))
            MigrationRunner.CleanupDatabase(productsDbConnectionString);
        MigrationRunner.RunMigrations(productsDbConnectionString);
        app.UseSwagger();
        app.UseSwaggerUI();

        if (!app.Environment.IsEnvironment("Automated_Tests"))
            app.InitializeProductsCatalogueDatabase();

        app.UseRouting();

        app.UseCors(options =>
        {
            options.AllowAnyOrigin();
            options.AllowAnyMethod();
            options.AllowAnyHeader();
        });

        app.UseAuthorization();

        app.MapProductsCatalogueEndpoints();

        app.Run();
    }
}
