using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Omniom;
[Tags("Omniom")]
[Migration(4)]
public class Migration0004_CreateUserProfileConfiguration : Migration
{
    private const string _userProfileTable = "user_profile_configuration";
    private const string _nutritionTargetsColumnName = "nutrition_targets_configuration";

    public override void Up()
    {
        Create.Column(_nutritionTargetsColumnName)
            .OnTable(_userProfileTable)
            .AsString().Nullable();
    }

    public override void Down()
    {
        Delete.Column(_nutritionTargetsColumnName).FromTable(_userProfileTable);
    }
}
