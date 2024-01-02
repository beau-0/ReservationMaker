import React, { useEffect, useState } from "react";
//import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";

const service = require("./dashboard.service");

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [displayDate, setDisplayDate] = useState(new Date(date));
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [errorState, setErrorState] = useState({message: null});

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const formattedDate = formatDate(displayDate);
        const reservationsData = await service.fetchReservations(formattedDate);
        const tablesData = await service.fetchTables(formattedDate);

        setReservations(reservationsData);
        setTables(tablesData);
        setErrorState({});
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setErrorState(error.message);
      }
    };

    loadDashboard();
  }, [displayDate]);

  const handlePreviousDay = () => {
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setDate(newDisplayDate.getDate() - 1);
    setDisplayDate(newDisplayDate);
  };

  const handleToday = () => {
    setDisplayDate(new Date());
  };

  const handleNextDay = () => {
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setDate(newDisplayDate.getDate() + 1);
    setDisplayDate(newDisplayDate);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <main>
      <h1>Dashboard</h1>
      {errorState.message && <ErrorAlert error={errorState}/>}

      {/* Date Navigation Buttons */}
      <div>
        <button onClick={handlePreviousDay}>Previous Day</button>
        <button onClick={handleToday}>Today</button>
        <button onClick={handleNextDay}>Next Day</button>
      </div>

      {/* Reservations Section */}
      <section>
      <h2>Reservations for {displayDate.toLocaleDateString()}</h2>
  {reservations.length > 0 ? (
    <ul>
      {reservations.map((reservation) => (
        <li key={reservation.reservation_id}>
          <p>
            Name: {reservation.first_name} {reservation.last_name}
            <br />
            Mobile Number: {reservation.mobile_number}
            <br />
            Date: {reservation.reservation_date}
            <br />
            Time: {reservation.reservation_time}
            <br />
            People: {reservation.people}
          </p>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No reservations for {displayDate.toLocaleDateString()}</p>
  )}

      </section>

      {/* Tables Section */}
      <section>
      <h2>Tables for {formatDate(displayDate)}</h2>
        <ul>
          {tables.map((table) => (
            <li key={table.table_id}>
              {table.table_name} - Capacity: {table.capacity} - {" "}
              <span data-table-id-status={table.table_id}>
                {table.reservation_id ? "Occupied" : "Free"}
              </span>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}

export default Dashboard;
