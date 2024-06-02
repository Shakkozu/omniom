using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Crm;

[Tags("Omniom")]
[Migration(10)]
public class Migration0010_AddNutritionistMealPlansTable: Migration
{
    private const string _mealPlansTableName = "meal_plans";
    public override void Up()
    {
        Create.Table(_mealPlansTableName)
            .WithColumn("id").AsInt32().PrimaryKey().Identity()
            .WithColumn("user_id").AsGuid().NotNullable().Indexed()
            .WithColumn("name").AsString().NotNullable()
            .WithColumn("status").AsString().NotNullable()
            .WithColumn("created_at").AsDateTime().NotNullable()
            .WithColumn("modified_at").AsDateTime().NotNullable()
            .WithColumn("guid").AsGuid().NotNullable()
            .WithColumn("daily_kcal_target").AsInt32().NotNullable()
            .WithColumn("details").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table(_mealPlansTableName);
    }
}
