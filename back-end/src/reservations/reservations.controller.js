const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */

async function reservationExists(req, res, next) {
  const {reservationId} = req.params;
  const reservation = await service.read(reservationId);
  if(reservation) {
      res.locals.reservation = reservation;
      return next();
  }
  next({ status: 404, message: `Reservation cannot be found. `})
}

function validateReservationData(req, res, next) {
  const reservationData = req.body.data;
  console.log("reservationData: ", reservationData)

  if (!reservationData) {
    return res.status(400).json({ error: 'Missing required data to make a reservation (all).' });
  }
    else if (!reservationData.first_name || !reservationData.last_name) {
      return res.status(400).json({ error: 'Missing required data. Please provide firstName and lastName.' });
    }
    next(); // Move to the next middleware or route handler;
  } 

async function list(req, res) {
  const reservations = await service.list();
  res.json({
    data: reservations,
  });
}

async function create(req, res, next) {
    const reservationData = req.body.data; 
    const reservationId = await service.create(reservationData);
    res.status(201).json({ data: reservationId });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateReservationData, asyncErrorBoundary(create)],
};
