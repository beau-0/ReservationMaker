const knex = require("../db/connection"); 

function assignTable(table_id, reservation_id) {
    console.log("table id: ", table_id)
    return knex("tables")
    .where({ table_id })
    .update({ reservation_id: reservation_id });
}

module.exports = {
    assignTable
  };