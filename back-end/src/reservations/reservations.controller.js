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

  // vars needed to check day of reservation date, day of week, and "today" in EST 
  let resTime = req.body.data.reservation_time;
  let resDate = req.body.data.reservation_date;
  let joinedDateTime = resDate + "T" + resTime;
  let reservationDateAndTime = new Date(joinedDateTime);
  let reservationDayOfWeek = reservationDateAndTime.getDay();
  var easternTimeString = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  var easternDateToday = new Date(easternTimeString);
  
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
    console.log("reservation timex req: ", reservationData.reservation_time );
    console.log("reservation Datex req: ", reservationData.reservation_date );
    console.log("reservation datex newDate: ", reservationDate );
    console.log("reservation Datex - newDate.toDay: ", reservationDate.getDay());

    let joinDateTime = resDate + "T" + reservationTime;
    let resDateAndTime = new Date(joinDateTime);
    let dayOfWeek = resDateAndTime.getDay();
    console.log("resDateAndTime: ", resDateAndTime, "day of week: ", dayOfWeek);


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
