using Omniom.DatabaseMigrator;

namespace Omniom.WebAPI;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();
        var productsDbConnectionString = app.Configuration.GetConnectionString("ProductsDatabase");

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            MigrationRunner.CleanupDatabase(productsDbConnectionString);
            MigrationRunner.RunMigrations(productsDbConnectionString);
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.Run();
    }
}