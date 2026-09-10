using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Example.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeSessionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Sessions",
                newName: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "id",
                table: "Sessions",
                newName: "Id");
        }
    }
}
