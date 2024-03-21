using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.NutritionDiary;

[Tags("Omniom")]
[Migration(00002)]
public class Migration0002_CreateNutritionDiary : Migration
{
    public override void Up()
    {
        Create.Table("diary_entries")
            .WithColumn("id").AsInt64().PrimaryKey().Identity()
            .WithColumn("guid").AsGuid().Indexed()
            .WithColumn("date").AsDateTime().NotNullable()
            .WithColumn("product_id").AsGuid().Indexed()
            .WithColumn("product_name").AsString().NotNullable()
            .WithColumn("user_id").AsGuid().Indexed()
            .WithColumn("meal_type").AsString().NotNullable()
            .WithColumn("portion_in_grams").AsDecimal(10, 3).NotNullable()
            .WithColumn("calories").AsDecimal(10, 3).NotNullable()
            .WithColumn("protein").AsDecimal(10, 3).NotNullable()
            .WithColumn("fat").AsDecimal(10, 3).NotNullable()
            .WithColumn("saturated_fat").AsDecimal(10, 3).NotNullable()
            .WithColumn("carbohydrates").AsDecimal(10, 3).NotNullable()
            .WithColumn("sugar").AsDecimal(10, 3).NotNullable();
    }

    public override void Down()
    {
        Delete.Table("diary_entries");
    }

}
