const service = require("./dashboard.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

function validateReservationData(req, res, next) {
  next(); // Move to the next middleware or route handler;
}

async function listDashboard(req, res) {
  try {
    const tablesData = await service.listTables();
    const reservationsData = await service.listReservationsByDate(req.query.date);
    console.log("ReservationsX: ", reservationsData)
    res.json({ reservations: reservationsData, tables: tablesData });
  } catch (error) {
      console.error("Error loading dashboard data:", error);
      res.status(500).json({ error: "Error loading dashboard data. Please try again." });
  }
}

module.exports = {
  listDashboard: [asyncErrorBoundary(listDashboard)],
};
