const knex = require("../db/connection"); 

function search(phoneNumber) {
  console.log("Phone Number: ", phoneNumber)
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${phoneNumber.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    search,
  };