using Microsoft.Extensions.Configuration;

namespace Omniom.DatabaseMigrator;

internal class Program
{
    static void Main(string[] args)
    {
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();
        var productsDatabaseConnectionString = config.GetConnectionString("ProductsDatabase");
        var omniomDatabaseConnectionString = config.GetConnectionString("OmniomDatabase");

        MigrationRunner.RunMigrations(productsDatabaseConnectionString, omniomDatabaseConnectionString);
    }
}
