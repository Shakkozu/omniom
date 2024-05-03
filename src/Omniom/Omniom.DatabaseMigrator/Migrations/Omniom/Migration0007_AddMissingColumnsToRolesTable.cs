using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Crm;

[Tags("Omniom")]
[Migration(7)]
public class Migration0007_AddMissingColumnsToRolesTable : Migration
{
    public override void Up()
    {
        Alter.Table("roles").AddColumn("concurrency_stamp").AsString().Nullable();
    }

    public override void Down()
    {
        Delete.Column("concurrency_stamp").FromTable("roles");
    }
}
