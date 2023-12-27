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
  const reservationDate = new Date(req.body.data.reservation_date);

  //Day and time for "today" adjusted to EST
  const today = new Date();
  const easternTimeZone = 'America/New_York';
  const options = { timeZone: easternTimeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateFormatter = new Intl.DateTimeFormat('en-US', options);
  const estToday = dateFormatter.format(today); // eastern timezone today

  console.log(`estToday: ${estToday}, reservationDate: ${reservationDate}`);

  if (reservationDate.getDay() === 2) {     // Tuesday is 2
    return res.status(400).json({
      error: "The restaurant is closed on Tuesdays. Please choose another date."
    });
  }

  if (reservationDate < estToday) {
    return res.status(400).json({
      error: "Reservations cannot be made for any day prior to today. Please choose a today or a future date."
    });
  }

  const requiredFields = [
    'first_name',
    'last_name',
    'mobile_number',
    'reservation_date',
    'reservation_time',
    'people'
  ];

  if (!req.body.data) 
    {return res.status(400).json({ error: 'Missing data.' })}

  const missingFields = requiredFields.filter((field) => !reservationData[field]);
  if (missingFields.length > 0 ) {
    return res.status(400).json({
      error: `Missing required data to make a reservation. Fields required: ${missingFields.join(', ')}.`,
    })
  }

  const partySize = reservationData.people;  
  if (typeof partySize !== 'number' || partySize <= 0) {
    return res.status(400).json({ error: 'Invalid number of people.' });
  }

    if (isNaN(reservationDate.getTime())) {
      return res.status(400).json({ error: `'reservation_date' must be a date.` });
    }

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const reservationTime = req.body.data.reservation_time;
    if (!timeRegex.test(reservationTime)) {
      return res.status(400).json({ error: `'reservation_time' must be a valid time in HH:mm format.` });
    }

  next(); // Move to the next middleware or route handler;
}

async function list(req, res) {
  const date =  req.query.date;
  const reservations = await service.list(date);
  res.json({
    data: reservations,
  });
}

async function create(req, res, next) {
    const reservationData = req.body.data; 
    const reservationId = await service.create(reservationData);
    res.status(201).json({ data: reservationData });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateReservationData, asyncErrorBoundary(create)],
};
