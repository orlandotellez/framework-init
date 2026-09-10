using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Example.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeAuthSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Users_UserId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "Verifications",
                newName: "value");

            migrationBuilder.RenameColumn(
                name: "Identifier",
                table: "Verifications",
                newName: "identifier");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Verifications",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Verifications",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "ExpiresAt",
                table: "Verifications",
                newName: "expires_at");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Verifications",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Users",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Users",
                newName: "image");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "Users",
                newName: "bio");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Users",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "LastSeenAt",
                table: "Users",
                newName: "last_seen_at");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Users",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "EmailVerified",
                table: "Users",
                newName: "email_verified");

            migrationBuilder.RenameColumn(
                name: "DeletedByUserId",
                table: "Users",
                newName: "deleted_by_user_id");

            migrationBuilder.RenameColumn(
                name: "DeletedByName",
                table: "Users",
                newName: "deleted_by_name");

            migrationBuilder.RenameColumn(
                name: "DeletedAt",
                table: "Users",
                newName: "deleted_at");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Token",
                table: "Sessions",
                newName: "token");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Sessions",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "UserAgent",
                table: "Sessions",
                newName: "user_agent");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Sessions",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "IpAddress",
                table: "Sessions",
                newName: "ip_address");

            migrationBuilder.RenameColumn(
                name: "ExpiresAt",
                table: "Sessions",
                newName: "expires_at");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Sessions",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions",
                newName: "IX_Sessions_user_id");

            migrationBuilder.RenameColumn(
                name: "Scope",
                table: "Accounts",
                newName: "scope");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Accounts",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Accounts",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Accounts",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Accounts",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "RefreshTokenExpiresAt",
                table: "Accounts",
                newName: "refresh_token_expires_at");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "Accounts",
                newName: "refresh_token");

            migrationBuilder.RenameColumn(
                name: "ProviderId",
                table: "Accounts",
                newName: "provider_id");

            migrationBuilder.RenameColumn(
                name: "IdToken",
                table: "Accounts",
                newName: "id_token");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Accounts",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "Accounts",
                newName: "account_id");

            migrationBuilder.RenameColumn(
                name: "AccessTokenExpiresAt",
                table: "Accounts",
                newName: "access_token_expires_at");

            migrationBuilder.RenameColumn(
                name: "AccessToken",
                table: "Accounts",
                newName: "access_token");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_UserId",
                table: "Accounts",
                newName: "IX_Accounts_user_id");

            migrationBuilder.AlterColumn<Guid>(
                name: "id",
                table: "Verifications",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "updated_at",
                table: "Verifications",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "Verifications",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "username",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "role",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "updated_at",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<bool>(
                name: "is_active",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "email_verified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<string>(
                name: "deleted_by_name",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Sessions",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "updated_at",
                table: "Sessions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "Sessions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Guid>(
                name: "id",
                table: "Accounts",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "updated_at",
                table: "Accounts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "Accounts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateIndex(
                name: "IX_Verifications_expires_at",
                table: "Verifications",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "IX_Verifications_identifier",
                table: "Verifications",
                column: "identifier");

            migrationBuilder.CreateIndex(
                name: "IX_Verifications_value",
                table: "Verifications",
                column: "value");

            migrationBuilder.CreateIndex(
                name: "idx_users_created_at",
                table: "Users",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_Users_email",
                table: "Users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_role",
                table: "Users",
                column: "role");

            migrationBuilder.CreateIndex(
                name: "IX_Users_username",
                table: "Users",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_expires_at",
                table: "Sessions",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_token",
                table: "Sessions",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_account_id",
                table: "Accounts",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_provider_id",
                table: "Accounts",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_provider_id_account_id",
                table: "Accounts",
                columns: new[] { "provider_id", "account_id" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Users_user_id",
                table: "Accounts",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Users_user_id",
                table: "Sessions",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Users_user_id",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_user_id",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Verifications_expires_at",
                table: "Verifications");

            migrationBuilder.DropIndex(
                name: "IX_Verifications_identifier",
                table: "Verifications");

            migrationBuilder.DropIndex(
                name: "IX_Verifications_value",
                table: "Verifications");

            migrationBuilder.DropIndex(
                name: "idx_users_created_at",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_role",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_username",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_expires_at",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_token",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_account_id",
                table: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_provider_id",
                table: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_provider_id_account_id",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "value",
                table: "Verifications",
                newName: "Value");

            migrationBuilder.RenameColumn(
                name: "identifier",
                table: "Verifications",
                newName: "Identifier");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Verifications",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Verifications",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "expires_at",
                table: "Verifications",
                newName: "ExpiresAt");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Verifications",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "role",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "Users",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "image",
                table: "Users",
                newName: "Image");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "bio",
                table: "Users",
                newName: "Bio");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Users",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "last_seen_at",
                table: "Users",
                newName: "LastSeenAt");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Users",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "email_verified",
                table: "Users",
                newName: "EmailVerified");

            migrationBuilder.RenameColumn(
                name: "deleted_by_user_id",
                table: "Users",
                newName: "DeletedByUserId");

            migrationBuilder.RenameColumn(
                name: "deleted_by_name",
                table: "Users",
                newName: "DeletedByName");

            migrationBuilder.RenameColumn(
                name: "deleted_at",
                table: "Users",
                newName: "DeletedAt");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "token",
                table: "Sessions",
                newName: "Token");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Sessions",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "user_agent",
                table: "Sessions",
                newName: "UserAgent");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Sessions",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "ip_address",
                table: "Sessions",
                newName: "IpAddress");

            migrationBuilder.RenameColumn(
                name: "expires_at",
                table: "Sessions",
                newName: "ExpiresAt");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Sessions",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Sessions_user_id",
                table: "Sessions",
                newName: "IX_Sessions_UserId");

            migrationBuilder.RenameColumn(
                name: "scope",
                table: "Accounts",
                newName: "Scope");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Accounts",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Accounts",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Accounts",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Accounts",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "refresh_token_expires_at",
                table: "Accounts",
                newName: "RefreshTokenExpiresAt");

            migrationBuilder.RenameColumn(
                name: "refresh_token",
                table: "Accounts",
                newName: "RefreshToken");

            migrationBuilder.RenameColumn(
                name: "provider_id",
                table: "Accounts",
                newName: "ProviderId");

            migrationBuilder.RenameColumn(
                name: "id_token",
                table: "Accounts",
                newName: "IdToken");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Accounts",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "account_id",
                table: "Accounts",
                newName: "AccountId");

            migrationBuilder.RenameColumn(
                name: "access_token_expires_at",
                table: "Accounts",
                newName: "AccessTokenExpiresAt");

            migrationBuilder.RenameColumn(
                name: "access_token",
                table: "Accounts",
                newName: "AccessToken");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_user_id",
                table: "Accounts",
                newName: "IX_Accounts_UserId");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Verifications",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Verifications",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Verifications",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Users",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "EmailVerified",
                table: "Users",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "DeletedByName",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Sessions",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Sessions",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Sessions",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Accounts",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Accounts",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Accounts",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Users_UserId",
                table: "Accounts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
