
exports.up = function (knex) {
    return knex.schema.table('tables', function (table) {
      // Drop the "occupied" column
      table.dropColumn('occupied');
    });
  };

  exports.down = function (knex) {
    return knex.schema.table('tables', function (table) {
      // If needed, recreate the "occupied" column here
      table.boolean('occupied').defaultTo(false);
    });
  };
