const knex = require("../db/connection"); 

function create (reservationData) {
    const timeStampedData = {
        ...reservationData,
        created_at: new Date(),
        updated_at: new Date(),
    }
    return knex ('reservations')
        .insert(timeStampedData)
        .returning('reservation_id');
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

module.exports = {
    create,
    list, 
    listDate,
  };