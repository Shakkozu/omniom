using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Crm;

[Tags("Omniom")]
[Migration(9)]
public class Migration0009_AddMealGuidToNutritionDiaryTable : Migration
{
    private const string _diaryEntriesTable = "diary_entries";
    public override void Up()
    {
        Alter.Table(_diaryEntriesTable)
            .AddColumn("user_meal_id").AsGuid().Nullable()
            .AddColumn("user_meal_name").AsString().Nullable()
            .AlterColumn("product_name").AsString().Nullable()
            .AlterColumn("product_id").AsGuid().Nullable();
    }

    public override void Down()
    {
        Delete.Column("user_meal_name").FromTable(_diaryEntriesTable);
        Delete.Column("user_meal_id").FromTable(_diaryEntriesTable);
    }
}
