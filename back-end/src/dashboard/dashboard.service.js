const knex = require("../db/connection"); 

function listReservationsByDate (date) {
    return knex ("reservations")
        .select("*")
        .where("reservation_date", date)
}

/*function listReservations() {
    try {
        return knex("reservations").select("*").orderBy("reservation_date");
    } catch (error) {
        throw error; // Propagate the error to be caught by the asyncErrorBoundary
    }
  };*/

  async function listTables() {
    try {
        return await knex("tables")
        .select("*")
        .orderBy("table_name", "asc");
    } catch (error) {
        throw error; // Propagate the error to be caught by the asyncErrorBoundary
    }
}

module.exports = {
    listReservationsByDate,
    listTables
  };