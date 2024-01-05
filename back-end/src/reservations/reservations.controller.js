const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

async function reservationExists (req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.` });
}

function validateReservationData(req, res, next) {

  const reservationData = req.body.data;
  // Extracting data from the request
  let reservationTime = req.body.data.reservation_time;
  let reservationDate = req.body.data.reservation_date;
  

  if (Object.keys(req.body.data).length === 0 || !req.body.data) {
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

  let resDateFormatted = new Date(reservationDate);
  if (isNaN(resDateFormatted.getTime())) {
    return res.status(400).json({ error: `'reservation_date' must be a date.` });
  }

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(reservationTime)) {
      return res.status(400).json({ error: `'reservation_time' must be a valid time in HH:mm format.` });
    }

  // Create a new Date object for the current date and time in Eastern Time
  let options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZone: "America/New_York" };
  let dateTimeFormatter = new Intl.DateTimeFormat("en-US", options);

  // Extract components from the user-entered date and time
  let [year, month, day] = reservationDate.split('-');
  let [hour, minute] = reservationTime.split(':');

  // Create a formatted string
  let reservationDateTimeFormatted = `${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(year, month - 1, day))}, ${new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZone: "America/New_York" }).format(new Date(year, month - 1, day, hour, minute))}`;
  let currentEasternDateFormatted = dateTimeFormatter.format(new Date());

  let reservationDateObject = new Date(reservationDateTimeFormatted);
  let currentEasternDateObject = new Date(currentEasternDateFormatted);
  let reservationDayOfWeekNumber = reservationDateObject.getDay();

  //convert time to minutes to enable comparisons 
  const convertToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }; 
    
    //US-02 validation
    if (reservationDayOfWeekNumber === 2) {     // Tuesday is 2
      return res.status(400).json({
        error: "The restaurant is closed on Tuesdays. Please choose another date."
      });
    }
    
    //US-02 validation 
    if (reservationDateObject < currentEasternDateObject) {
      return res.status(400).json({
        error: "Reservations cannot be made for any day prior to today. Please choose a today or a future date."
      });
    }

    //US-03 validation
    const reservationMinutes = convertToMinutes(reservationTime);
    //const openMinutes = convertToMinutes("10:30");
    //const closeMinutes = convertToMinutes("21:30");
    if (reservationMinutes < convertToMinutes("10:30") || reservationMinutes > convertToMinutes("21:30")) {
      return res.status(400).json({
        error: "Restaurant reservations hours are 10:30 AM to 9:30 PM (EST)."
      });
    }

  next(); // Move to the next middleware or route handler;
}

async function list(req, res) {
  const { date, mobile_number } = req.query;

    let data;

    if (date) {
      data = await service.listDate(date);
    } else if (mobile_number) {
      data = await service.search(mobile_number);
    } else {
    data = await service.list();
    }

    res.json({ data });
}

async function create(req, res) {
    const reservationData = req.body.data; 
    const status = reservationData.status;

    if (status === 'seated' || status === 'finished') {
      return res.status(400).json({ error: `Reservation status is "${status}. Invalid reservation status.`});
    }

    const insertedReservation = await service.create(reservationData);
    res.status(201).json({ data: reservationData });
}

async function seatTable(req, res) {
    const {reservation_id} = req.params;
    console.log("xxx: ", req.body.data)
    const table_id = req.body.data.table_id;
    await service.assignTable(table_id, reservation_id)
    res.json({ message: 'Table assigned successfully' });
}

async function read(req, res) {
  const { reservation_id } = req.params;
  let data = await service.read(reservation_id);

  if(!data){
    res.status(404).json({ error: `${reservation_id} not found.`});
    return;
  }
  res.status(200).json({ data });
}

async function updateReservationStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  try {
    const updatedReservation = await service.updateReservationStatus(
      reservation_id,
      status
    );

    res.status(200).json({ data: { status: req.body.data.status } });
  } catch (error) {
    next(error);
  }
}

async function validateStatusData (req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const reservation = res.locals.reservation;

  if (status === 'unknown') {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }

  if (reservation.status !== "finished" && reservation.status !== "seated" && reservation.status !== "booked") {
    return res.status(400).json({ error: `Reservation ${reservation_id} status is ${reservation.status}.` });
  }

  if (reservation.status === 'finished') {
    return res.status(400).json({ error: `Reservation ${reservation_id} is in a finished status.` });
  }

  next();
}

async function search (req, res, next) {

  const { mobile_number } = req.query;
  const results = await service.search(mobile_number);

  console.log("We're hitting back: ", mobile_number, results);

  res.status(200).json({
      success: true,
      data: results,
    });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateReservationData, asyncErrorBoundary(create)],
  seatTable: [asyncErrorBoundary(seatTable)],
  read, 
  updateReservationStatus: [asyncErrorBoundary(reservationExists), validateStatusData, updateReservationStatus],
  search,
};