using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Crm;

[Tags("Omniom")]
[Migration(8)]
public class Migration0008_AddMealsTable: Migration
{
    public override void Up()
    {
        Create.Table("user_meals")
            .WithColumn("id").AsInt32().PrimaryKey().Identity()
            .WithColumn("user_id").AsGuid().NotNullable().Indexed()
            .WithColumn("guid").AsGuid().NotNullable().Unique()
            .WithColumn("name").AsString().NotNullable().Indexed()
            .WithColumn("description").AsString().Nullable()
            .WithColumn("recipe").AsString().Nullable()
            .WithColumn("portions").AsInt32().NotNullable()
            .WithColumn("ingredients").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("user_meals");
    }
}
