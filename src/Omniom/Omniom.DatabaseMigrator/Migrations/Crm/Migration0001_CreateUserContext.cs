﻿using FluentMigrator;

namespace Omniom.DatabaseMigrator.Migrations.Crm;

[Tags("Auth")]
[Migration(1)]
public class Migration0001_CreateUserContext : Migration
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsInt32().PrimaryKey().Identity()
            .WithColumn("username").AsString().NotNullable()
            .WithColumn("normalized_username").AsString().NotNullable()
            .WithColumn("email").AsString().NotNullable()
            .WithColumn("normalized_email").AsString().NotNullable()
            .WithColumn("email_confirmed").AsBoolean().NotNullable()
            .WithColumn("password_hash").AsString().NotNullable()
            .WithColumn("security_stamp").AsString().NotNullable()
            .WithColumn("concurrency_stamp").AsString().NotNullable()
            .WithColumn("phone_number").AsString().NotNullable()
            .WithColumn("phone_number_confirmed").AsBoolean().NotNullable()
            .WithColumn("two_factor_enabled").AsBoolean().NotNullable()
            .WithColumn("lockout_end").AsDateTime().NotNullable()
            .WithColumn("lockout_enabled").AsBoolean().NotNullable()
            .WithColumn("access_failed_count").AsInt32().NotNullable();

        Create.Table("roles")
            .WithColumn("id").AsInt32().PrimaryKey().Identity()
            .WithColumn("name").AsString().NotNullable()
            .WithColumn("normalized_name").AsString().NotNullable();

        Create.Table("user_roles")
            .WithColumn("user_id").AsString().NotNullable()
            .WithColumn("role_id").AsString().NotNullable();

        Create.Table("user_claims")
            .WithColumn("id").AsInt32().PrimaryKey().Identity()
            .WithColumn("user_id").AsString().NotNullable()
            .WithColumn("claim_type").AsString().NotNullable()
            .WithColumn("claim_value").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("users");
        Delete.Table("roles");
        Delete.Table("user_roles");
        Delete.Table("user_claims");
    }
}
