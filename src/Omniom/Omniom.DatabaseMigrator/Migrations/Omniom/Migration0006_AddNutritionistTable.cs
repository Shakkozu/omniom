using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Omniom;

[Tags("Omniom")]
[Migration(6)]
public class Migration0006_AddNutritionistTable : Migration
{
    public override void Up()
    {
        Create.Table("nutritionists")
            .WithColumn("id").AsInt64().Identity().PrimaryKey()
            .WithColumn("guid").AsGuid()
            .WithColumn("user_id").AsGuid().NotNullable()
            .WithColumn("first_name").AsString().NotNullable()
            .WithColumn("last_name").AsString().NotNullable()
            .WithColumn("city").AsString().Nullable()
            .WithColumn("email").AsString().NotNullable()
            .WithColumn("is_verified").AsBoolean().NotNullable()
            .WithColumn("terms_and_conditions_accepted").AsBoolean().NotNullable()
            .WithColumn("created_at").AsDateTime().NotNullable()
            .WithColumn("updated_at").AsDateTime().NotNullable();

        
    }
    
    public override void Down()
    {
        Delete.Table("nutritionists");
    }
}