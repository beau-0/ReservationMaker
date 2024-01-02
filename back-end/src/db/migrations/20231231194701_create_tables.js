exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name").notNullable();
        table.integer("capacity").notNullable();
        table.boolean("occupied").defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("tables");
};
