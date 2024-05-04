using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Omniom;

[Tags("Omniom")]
[Migration(5)]
public class Migration0005_AddNutritionistVerificationTables : Migration
{
    public override void Up()
    {
        Create.Table("nutritionist_verification_requests")
            .WithColumn("id").AsInt64().PrimaryKey().Identity()
            .WithColumn("guid").AsGuid().NotNullable().Unique()
            .WithColumn("user_id").AsGuid().NotNullable()
            .WithColumn("status").AsString().NotNullable()
            .WithColumn("message").AsString().Nullable()
            .WithColumn("created_at").AsDateTime().NotNullable()
            .WithColumn("updated_at").AsDateTime().NotNullable();

        Create.Table("nutritionist_verification_attachments")
            .WithColumn("id").AsInt64().PrimaryKey().Identity()
            .WithColumn("request_guid").AsGuid().NotNullable().ForeignKey("nutritionist_verification_requests", "guid")
            .WithColumn("file_content").AsString().NotNullable()
            .WithColumn("file_name").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("nutritionist_verification_attachments");
        Delete.Table("nutritionist_verification_requests");
    }
}