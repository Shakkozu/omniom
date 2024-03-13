using FluentMigrator.Runner;
using FluentMigrator.Runner.Initialization;
using Microsoft.Extensions.DependencyInjection;
using Omniom.DatabaseMigrator.Migrations.Crm;
using Omniom.DatabaseMigrator.Migrations.Products;

namespace Omniom.DatabaseMigrator;

public static class MigrationRunner
{
    public static void RunMigrations(string? productsDatabaseConnectionString, string? omniomDatabaseConnectionString)
    {
        MigrateProductsDatabase(productsDatabaseConnectionString,
            runner => runner.MigrateUp());

        MigrateOmniomDatabase(omniomDatabaseConnectionString,
            runner => runner.MigrateUp());
    }

    public static void CleanupDatabase(string? productsDatabaseConnectionString, string omniomDatabaseConnectionString)
    {
        MigrateProductsDatabase(productsDatabaseConnectionString,
            runner => runner.MigrateDown(0));

        MigrateOmniomDatabase(omniomDatabaseConnectionString,
            runner => runner.MigrateDown(0));
    }

    private static void MigrateProductsDatabase(string? productsDatabaseConnectionString, Action<IMigrationRunner> migrationAction)
    {
        if (string.IsNullOrEmpty(productsDatabaseConnectionString))
            throw new ArgumentException("Connection string for Products database is not provided!");

        using (var serviceProvider = RegisterProductsCatalogueMigrationRunner(productsDatabaseConnectionString))
        using (var scope = serviceProvider.CreateScope())
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            migrationAction(runner);
        }
    }

    private static void MigrateOmniomDatabase(string? omniomDatabaseConnectionString, Action<IMigrationRunner> migrationAction)
    {
        if (string.IsNullOrEmpty(omniomDatabaseConnectionString))
            throw new ArgumentException("Connection string for Omniom database is not provided!");

        using (var serviceProvider = CreateServiceProviderForOmniomDatabase(omniomDatabaseConnectionString))
        using (var scope = serviceProvider.CreateScope())
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            migrationAction(runner);
        }
    }

    private static ServiceProvider RegisterProductsCatalogueMigrationRunner(string connectionString)
    {
        return new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddPostgres()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(Migration0001_CreateProductsDatabase).Assembly))
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .Configure<RunnerOptions>(options =>
            {
                options.Tags = new[] { "ProductsCatalogue" };
            })
            .BuildServiceProvider(false);
    }

    private static ServiceProvider CreateServiceProviderForOmniomDatabase(string connectionString)
    {
        return new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddPostgres()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(Migration0001_CreateUserContext).Assembly).For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .Configure<RunnerOptions>(options =>
            {
                options.Tags = new[] { "Auth" };
            })
            .BuildServiceProvider(false);
    }
}