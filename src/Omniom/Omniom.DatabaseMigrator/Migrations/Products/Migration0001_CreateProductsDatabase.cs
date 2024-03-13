using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Products;

[Tags("ProductsCatalogue")]
[Migration(00001)]
public class Migration0001_CreateProductsDatabase : Migration
{
    public override void Up()
    {
        Create.Table("products_data")
            .WithColumn("id").AsInt64().PrimaryKey().Identity()
            .WithColumn("guid").AsGuid()
            .WithColumn("code").AsString().Unique().Nullable()
            .WithColumn("product_name_pl").AsString().Indexed("IX_products_data_name")
            .WithColumn("generic_name_pl").AsString().Indexed("IX_products_data_generic_name").Nullable()
            .WithColumn("quantity_g").AsInt32().Nullable()
            .WithColumn("serving_size_g").AsInt32().Nullable()
            .WithColumn("brands").AsString().Nullable()
            .WithColumn("categories").AsString().Nullable()
            .WithColumn("categories_tags").AsString().Nullable()
            .WithColumn("energy_kcal").AsDecimal(10, 3).Nullable()
            .WithColumn("fat_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("saturated_fat_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("carbohydrates_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("sugars_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("fiber_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("proteins_value_g").AsDecimal(10, 3).Nullable()
            .WithColumn("salt_value_g").AsDecimal(10, 3).Nullable();
    }

    public override void Down()
    {
        Delete.Table("products_data");
    }

}
