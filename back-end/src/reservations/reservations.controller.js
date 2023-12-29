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

  // Extracting data from the request
  let resTime = req.body.data.reservation_time;
  let resDate = req.body.data.reservation_date;

  // Combine date and time strings and create a Date object for the reservation
  let joinedDateTime = resDate + "T" + resTime;
  let reservationDateAndTime = new Date(joinedDateTime);

  // Create a Date object for the current date in Eastern Time
  let currentEasternDate = new Date();
  currentEasternDate.toLocaleString('en-US', { timeZone: 'America/New_York' });

  // Get the day of the week for the reservation
  let reservationDayOfWeek = reservationDateAndTime.getDay();

  // Set the minimum allowed time for reservations (10:30 AM)
  let minReservationTime = new Date(currentEasternDate);
  minReservationTime.setHours(5, 30); //utc, -05 offset 

  console.log("xx: ", resDate, resTime, "EST Today: ", easternDateToday, )

  if (!req.body.data) {
    return res.status(400).json({ error: 'Missing data.' });
  }

  const requiredFields = [
    'first_name',
    'last_name',
    'mobile_number',
    'reservation_date',
    'reservation_time',
    'people'
  ];

  if (!req.body.data) {
    return res.status(400).json({ error: 'Missing data.' })
  }

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

    let joinDateTime = resDate + "T" + reservationTime;
    let resDateAndTime = new Date(joinDateTime);
    let dayOfWeek = resDateAndTime.getDay();

    //US-02 validation
    if (reservationDayOfWeek === 2) {     // Tuesday is 2
      return res.status(400).json({
        error: "The restaurant is closed on Tuesdays. Please choose another date."
      });
    }
    
    //US-02 validation 
    let today = new Date();
    if (reservationDateAndTime < easternDateToday) {
      return res.status(400).json({
        error: "Reservations cannot be made for any day prior to today. Please choose a today or a future date."
      });
    }

    //US-03 validation
    if (reservationDateAndTime < minReservationTime || reservationDateAndTime > maxReservationTime) {
      return res.status(400).json({
        error: "Restaurant reservations hours are 10:30 AM to 9:30 PM (EST)."
      });
    }

  next(); // Move to the next middleware or route handler;
}

async function list(req, res) {
  const { date } = req.query
  let data
  if (date) {
    data = await service.listDate(date)
  } else {
    data = await service.list()
  }
  res.json({ data });
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
