using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Omniom;
[Tags("Omniom")]
[Migration(3)]
public class Migration0003_CreateUserProfileConfiguration : Migration
{
    public override void Up()
    {
        Create.Table("user_profile_configuration")
            .WithColumn("id").AsInt64().PrimaryKey().Identity()
            .WithColumn("guid").AsGuid().Indexed()
            .WithColumn("user_id").AsGuid().Indexed()
            .WithColumn("meals_configuration").AsString().Nullable();
    }

    public override void Down()
    {
        Delete.Table("user_profile_configuration");
    }
}
