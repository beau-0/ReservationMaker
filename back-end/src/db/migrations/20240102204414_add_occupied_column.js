exports.up = function (knex) {
    return knex.schema.table('tables', function (table) {
      // Add the "occupied" column
      table.boolean('occupied').defaultTo(false);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table('tables', function (table) {
      // Drop the "occupied" column if needed
      table.dropColumn('occupied');
    });
  };