
exports.up = function (knex) {
    return knex.schema.alterTable("tables", (table) => {
      // Add the reservation_id column
      table
        .integer("reservation_id")
        .unsigned()
        .references("reservation_id")
        .inTable("reservations")
        .onDelete("CASCADE");
    });
  };

  exports.down = function (knex) {
    return knex.schema.alterTable("tables", (table) => {
      // Drop the reservation_id column
      table.dropColumn("reservation_id");
    });
  };
