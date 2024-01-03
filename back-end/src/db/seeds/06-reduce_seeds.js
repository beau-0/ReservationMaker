exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tables")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tables").insert([
        { table_name: "#1", capacity: 6, occupied: false },
        { table_name: "#2", capacity: 6, occupied: false },
        { table_name: "Bar #1", capacity: 1, occupied: false },
        { table_name: "Bar #2", capacity: 1, occupied: false },
      ]);
    })
    .catch(function (error) {
      console.error('Error seeding tables:', error);
    });
};