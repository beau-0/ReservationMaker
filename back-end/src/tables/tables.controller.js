const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservations_service = require("../reservations/reservations.service.js");

async function tableExists (req, res, next) {
  const { table_id } = req.params;
  const table = await service.getTableById(table_id);
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: `Table ${table_id} cannot be found.` });
}

/* function tableOccupied (req, res, next) {
  const { table_id } = res.locals.table.table_id;

  if (!res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is not occupied`,});
  }
  next();
} */

function tableOccupied (req, res, next) {  
const table = res.locals.table;

if (!table.reservation_id){
  next({
      status: 400,
      message: "Table is not occupied"
  })
}
res.locals.table = table;
next();
}

async function validateTableData(req, res, next) {
  const { reservation_id, table_name, capacity } = req.body.data;

  if ( !req.body.data) {
    return res.status(400).json({ error: 'Missing request data.' });
  }

  if (!table_name || table_name.trim().length === 1) {
    return res.status(400).json({ error: 'Invalid table_name. It must be longer than one character.' });
  }

  if (!capacity) {
    return res.status(400).json({ error: 'Missing table capacity.'})
  }

  if (capacity === 0) {
    return res.status(400).json({ error: 'Table capacity at zero.'})
  }

  if (typeof capacity === "string") {
    return res.status(400).json({ error: 'Invalid capacity. Capacity must be a positive number.' });
  }  

  if (reservation_id) {
    return res.status(400).json({ error: 'Table is already occupied.' });
  }

  next(); // Move to the next middleware or route handler;
}

async function validateSeatingData(req, res, next) {


  if (!req.body.data === undefined) {
    return res.status(400).json({ error: 'Missing request data.' });
  }

  if (!req.body.data.reservation_id) {
    return res.status(400).json({ error: 'Missing reservation_id.' });
  }

  const { table_id } = req.params;
  const reservation_id = req.body.data.reservation_id;

  try {
    let table = await service.getTableById(table_id);
    let reservation = await service.getReservationById(reservation_id);

    if(!reservation) {
      return res.status(404).json({ error: `Reservation ${reservation_id} not found.` });
    }
    
    if (reservation.people > table.capacity) {
      return res.status(400).json({ error: 'Party size exceeds table capacity.' });
    };

    if (table.reservation_id) {
      return res.status(400).json({ error: 'Table is already occupied.' });
    }

  } catch (error) {
    console.error(error)
  }

  next(); // Move to the next middleware or route handler;
} 

async function create(req, res) {
  const tableData = req.body.data; 
  await service.createTable(tableData);
  res.status(201).json({ data: tableData });
}

async function listTables(req, res) {
  try {
    const tablesData = await service.listTables();
    res.json({ data: tablesData });
  } catch (error) {
      console.error("Error loading dashboard data:", error);
      res.status(500).json({ error: "Error loading dashboard data. Please try again." });
  }
}

async function seatTable(req, res) {
  const {table_id} = req.params;
  const reservation_id = req.body.data.reservation_id;
  const newStatus = "seated"

  //Check the status of the current reservation
  const currentReservation = await reservations_service.read(reservation_id);
  if (currentReservation.status === newStatus) {
    return res.status(400).json({ error: `Reservation ${reservation_id} is already seated.` });
  }

  // assign reservation_id to table
  const tableAssigned = await service.assignTable(table_id, reservation_id);

  // update reservation status from "booked" to "seated          "
  const statusUpdated = await reservations_service.updateReservationStatus(reservation_id, newStatus);

  res.status(200).json({ message: 'Table assigned successfully' });
} 

async function unseatTable (req, res) {

  const table_id = res.locals.table.table_id;
  const reservation_id = res.locals.table.reservation_id;
  const status = "finished";
  console.log("ASDF: ", res.locals.table, reservation_id)

  // remove reservation_id from table 
  await service.unseatTable(table_id);

  // change status to "finished"
  await reservations_service.updateReservationStatus(reservation_id, status);

  res.status(200).json({ table_id })
}

module.exports = {
    seatTable: [validateSeatingData, asyncErrorBoundary(seatTable)],
    create: [validateTableData, asyncErrorBoundary(create)],
    listTables,
    delete: [tableExists, tableOccupied, unseatTable]
  };