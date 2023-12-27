import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [displayDate, setDisplayDate] = useState(new Date(date));
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [displayDate, loadDashboard]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: displayDate.toLocaleDateString() }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handlePreviousDay = () => {
    let previousDay = new Date(displayDate);
    previousDay.setDate(displayDate.getDate() - 1);
    setDisplayDate(previousDay);
    loadDashboard();
  };

  const handleNextDay = () => {
    let nextDay = new Date(displayDate);
    nextDay.setDate(displayDate.getDate() + 1);
    setDisplayDate(nextDay);
    loadDashboard();
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {new Date(displayDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h4>
        <div className="ml-auto">
          <button className="btn btn-primary mr-2" onClick={handlePreviousDay}>Previous Day</button>
          <button className="btn btn-primary" onClick={handleNextDay}>Next Day</button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
