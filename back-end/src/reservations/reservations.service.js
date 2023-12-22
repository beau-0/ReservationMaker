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

module.exports = {
    create,
  };