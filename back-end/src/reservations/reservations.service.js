const knex = require("../db/connection"); 

function create (reservationData) {
    const timeStampedData = {
        ...reservationData,
        created_at: new Date(),
        updated_at: new Date(),
    }
    try {
    return knex ('reservations')
        .insert(timeStampedData)
        .returning('*');
    } catch (error) {
        throw error; // Propagate the error to be caught by the asyncErrorBoundary
    }
}

function listDate (date) {
    return knex ('reservations')
        .select('*')
        .where('reservation_date', date)
        .orderBy('reservation_time', 'asc');
}

function list() {
    return knex("reservations")
      .select("*")
      .orderBy("reservation_time");
  };

function assignTable(table_id, reservation_id) {
    console.log("table id: ", table_id)
    return knex("tables")
    .where({ table_id })
    .update({ reservation_id: reservation_id });
}

module.exports = {
    create,
    list, 
    listDate,
    assignTable
  };