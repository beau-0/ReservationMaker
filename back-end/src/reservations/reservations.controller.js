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

  if (!reservationData || !reservationData.firstName || !reservationData.lastName) {
    return res.status(400).json({ error: 'Missing required data. Please provide firstName and lastName.' });
  }
  next(); // Move to the next middleware or route handler
}

async function list(req, res) {
  res.json({
    data: [],
  });
}

async function create(req, res, next) {
  try {
    const reservationData = req.body.data; 
    const reservationId = await service.create(reservationData);
    res.status(201).json({ data: reservationId })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: [reservationExists, list],
  create: [validateReservationData, asyncErrorBoundary(create)],
};
