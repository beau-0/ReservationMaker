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

        // Filter out finished reservations 
        const activeReservations = reservationsData.filter(reservation => reservation.status !== 'finished');

        // Fetch all tables
        const tablesData = await service.fetchTables(formattedDate);

        setReservations(activeReservations);
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

  const handleFinish = async (table_id, reservation_id) => {

    const isConfirmed = window.confirm("Is this table ready to seat new guests? This cannot be undone.")

    if (isConfirmed) {
      try {
        // Send DELETE request to release the table
        await service.finishTable(table_id);

        // Update table status to 'finished'
        await service.updateReservationStatus(reservation_id, 'finished');

        // Refresh the list of tables
        const updatedTables = await service.fetchTables(formatDate(displayDate));
        const updatedReservations = await service.fetchReservations(formatDate(displayDate));
        
        setTables(updatedTables);
        setReservations(updatedReservations);
        setErrorState({}); // Clear any previous error state
       } catch (error) {
        console.error("Error finishing table:", error);
        setErrorState({ message: error.message });
      }   
    }
  };

const handleSeat = async (reservation_id) => {
  try {
    // Update reservation status to "seated"
    await service.updateReservationStatus(reservation_id, 'seated');
    
    // Refresh the list of reservations
    const updatedReservations = await service.fetchReservations(formatDate(displayDate));
    setReservations(updatedReservations);
    setErrorState({});
  } catch (error) {
    console.error("Error updating reservation status:", error);
    setErrorState({ message: error.message });
  }
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
            Reservation ID: {reservation.reservation_id}
            <br />
            Name: {reservation.first_name} {reservation.last_name}
            <br />
            Mobile Number: {reservation.mobile_number}
            <br />
            Date: {reservation.reservation_date}
            <br />
            Time: {reservation.reservation_time}
            <br />
            People: {reservation.people}
            <br />
            Status: <span data-reservation-id-status={reservation.reservation_id}>{reservation.status}</span>
          </p>
        {reservation.status === 'booked' && (
          <button type="button" onClick={() => handleSeat(reservation.reservation_id)}>
            Seat
          </button>
        )}
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
    {table.reservation_id ? (
      <>
        <span data-table-id-status={table.table_id}>
          Occupied {" "}
          <button
            type="button"
            data-table-id-finish={table.table_id}
            onClick={() => handleFinish(table.table_id)}
          >
            Finish
          </button>
        </span>
      </>
    ) : (
      <span data-table-id-status={table.table_id}>
        Open
      </span>
    )}
  </li>
))}
</ul>
    </section>

  </main>
);
}

export default Dashboard;
