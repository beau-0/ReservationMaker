exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("tables")
      .del()
      .then(function () {
        // Inserts seed entries
        return knex("tables").insert([
          { table_name: "Bar #1", capacity: 1, occupied: false },
          { table_name: "Bar #2", capacity: 1, occupied: false },
          { table_name: "Bar #3", capacity: 1, occupied: false },
          { table_name: "Bar #4", capacity: 1, occupied: false },
          { table_name: "Bar #5", capacity: 1, occupied: false },
          { table_name: "Bar #6", capacity: 1, occupied: false },
          { table_name: "Bar #7", capacity: 1, occupied: false },
          { table_name: "Bar #8", capacity: 1, occupied: false },
          { table_name: "#1", capacity: 4, occupied: false },
          { table_name: "#2", capacity: 4, occupied: false },
          { table_name: "#3", capacity: 4, occupied: false },
          { table_name: "#4", capacity: 4, occupied: false },
          { table_name: "#5", capacity: 6, occupied: false },
          { table_name: "#6", capacity: 6, occupied: false },
          { table_name: "#7", capacity: 6, occupied: false },
          { table_name: "#8", capacity: 6, occupied: false },
          { table_name: "#9", capacity: 6, occupied: false },
          { table_name: "#10", capacity: 8, occupied: false },
          { table_name: "#11", capacity: 8, occupied: false },
          { table_name: "#12", capacity: 8, occupied: false },
          { table_name: "#13", capacity: 8, occupied: false },
          { table_name: "#14", capacity: 6, occupied: false },
          { table_name: "#15", capacity: 6, occupied: false },
          { table_name: "#16", capacity: 4, occupied: false },
          { table_name: "#17", capacity: 4, occupied: false },
          { table_name: "#18", capacity: 4, occupied: false },
        ]);
      });
  };