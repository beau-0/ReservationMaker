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
  const [displayDate, setDisplayDate] = useState(date);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [errorState, setErrorState] = useState({message: null});
  const [errors, setErrors] = useState({});


  useEffect(() => {

  const loadDashboard = async () => {
    try {
      //const formattedDate = formatDate(displayDate);
      const reservationsData = await service.fetchReservations(displayDate);

      // Filter out finished reservations 
      const activeReservations = reservationsData.filter(reservation => reservation.status !== 'finished');

      // Fetch all tables
      const tablesData = await service.fetchTables(displayDate);

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

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleToday = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    setDisplayDate(formattedDate);
  };
  
  const handlePreviousDay = () => {
    const [year, month, day] = displayDate.split("-");
    const previousDay = new Date(year, month - 1, day);
    previousDay.setDate(previousDay.getDate() - 1);
    const formattedDate = formatDate(previousDay);
    setDisplayDate(formattedDate);
  };
  
  const handleNextDay = () => {
    const [year, month, day] = displayDate.split("-");
    const nextDay = new Date(year, month - 1, day);
    nextDay.setDate(nextDay.getDate() + 1);
    const formattedDate = formatDate(nextDay);
    setDisplayDate(formattedDate);
  };

  const handleCancelReservation = async (reservation_id) => {
    const reservationId = reservation_id; 
    const confirmation = window.confirm("Do you want to cancel this reservation? This cannot be undone.");

    if (confirmation) {
        try {
            // Make a PUT request to update reservation status to "cancelled"
            await service.updateReservationStatus(reservationId, { data: { status: "cancelled" } });

            // Refresh the list of tables
            const updatedTables = await service.fetchTables(displayDate);
          
            // refresh reservations and filter out "finished" reservations
            const updatedReservations = await service.fetchReservations(displayDate);
            const activeReservations = updatedReservations.filter(reservation => reservation.status !== 'finished');


        } catch (error) {
            console.error("Error cancelling reservation:", error);
            setErrors({ cancel: "Failed to cancel reservation. Please try again." });
        }
    }
  };

  const handleFinish = async (table_id, reservation_id) => {

    const isConfirmed = window.confirm("Is this table ready to seat new guests? This cannot be undone.")

    if (isConfirmed) {
      try {
        // Send DELETE request to release the table
        await service.finishTable(table_id);

        // Refresh the list of tables
        const updatedTables = await service.fetchTables(displayDate);
          
        // refresh reservations and filter out "finished" reservations
        const updatedReservations = await service.fetchReservations(displayDate);
        const activeReservations = updatedReservations.filter(reservation => reservation.status !== 'finished');
        
        setTables(updatedTables);
        setReservations(activeReservations);
        setErrorState({}); // Clear any previous error state
       } catch (error) {
        console.error("Error finishing table:", error);
        setErrorState({ message: error.message });
      }   
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
<h2>Reservations for {displayDate}</h2>
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
          Date: {displayDate}
          <br />
          Time: {reservation.reservation_time}
          <br />
          People: {reservation.people}
          <br />
          Status: <span data-reservation-id-status={reservation.reservation_id}>{reservation.status}</span>
        </p>
        {reservation.status === 'booked' && (
          <div>
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
            </Link>
            {' '}
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button type="button">Edit</button>
            </Link>
            {' '}
            <button
              type="button"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => handleCancelReservation(reservation.reservation_id)}
            >
              Cancel
            </button>
          </div>
        )}
      </li>
    ))}
  </ul>
) : (
  <p>No reservations for {displayDate}</p>
)}
</section>

    {/* Tables Section */}
    <section>
    <h2>Tables </h2>
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
            onClick={() => handleFinish(table.table_id, table.reservation_id)}
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