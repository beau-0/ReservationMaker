const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function seatTable(req, res) {
    const {table_id} = req.params;
    console.log("xxx: ", req.body.data)
    const reservation_id = req.body.data.table_id;
    await service.assignTable(table_id, reservation_id)
    res.json({ message: 'Table assigned successfully' });
}

module.exports = {
    seatTable: [asyncErrorBoundary(seatTable)]
  };