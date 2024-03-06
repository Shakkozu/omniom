using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Omniom.DatabaseMigrator.Migrations.Products;

namespace Omniom.DatabaseMigrator;

public static class MigrationRunner
{
    public static void RunMigrations(string? productsDatabaseConnectionString)
    {
        MigrateProductsDatabase(productsDatabaseConnectionString,
            runner => runner.MigrateUp());
    }

    public static void CleanupDatabase(string? productsDatabaseConnectionString)
    {
        MigrateProductsDatabase(productsDatabaseConnectionString,
            runner => runner.MigrateDown(0));
    }

    private static void MigrateProductsDatabase(string? productsDatabaseConnectionString, Action<IMigrationRunner> migrationAction)
    {
        if (string.IsNullOrEmpty(productsDatabaseConnectionString))
            throw new ArgumentException("Connection string for Products database is not provided!");

        using (var serviceProvider = CreateServices(productsDatabaseConnectionString))
        using (var scope = serviceProvider.CreateScope())
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            migrationAction(runner);
        }
    }

    private static ServiceProvider CreateServices(string connectionString)
    {
        return new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddPostgres()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(Migration0001_CreateProductsDatabase).Assembly).For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .BuildServiceProvider(false);
    }
}