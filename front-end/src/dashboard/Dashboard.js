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
  <div className="dashboard-container custom-background">

<div className="main-content">
  {/* Jumbotron with an image */}
  <div className="jumbotron position-relative overflow-hidden">
    <img
      src="https://i.ibb.co/dGCBBYN/yyyyyx219199018-fb-cover-1-2222222.jpg"
      alt="Reservista Banner"
      className="img-fluid w-100 h-100 object-cover"
    />
    <div className="overlay"></div>
    <div className="jumbotron-content text-center text-white position-absolute w-100">
      <h1 className="display-4 font-lucida" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        Reservista .. Your Table Awaits
      </h1>
    </div>
  </div>
</div>


    {errorState.message && <ErrorAlert error={errorState}/>}

    {/* Date Navigation Buttons */}
    <div className="nav-section">
      <button onClick={handlePreviousDay} className="btn btn-warning nav-buttons btn-lg mr-2">Previous Day</button>
      <button onClick={handleToday} className="btn btn-warning nav-buttons btn-lg mr-2">Today</button>
      <button onClick={handleNextDay} className="btn btn-warning nav-buttons btn-lg mr-2">Next Day</button>
    </div>

    <div className="row">
    {/* Reservations Section - 2/3 width*/}
    <section className="reservations-section">
          <h4>Reservations for {displayDate}</h4>
          {reservations.length > 0 ? (
            <table className="table table-bordered shadow">
              <thead>
                <tr>
                  <th style={{ height: '40px' }}>ID</th>
                  <th style={{ height: '40px' }}>Name & Phone</th> {/* Combine Name and Phone into one column */}
                  <th style={{ height: '40px' }}>Date</th>
                  <th style={{ height: '40px' }}>Time</th>
                  <th style={{ height: '40px' }}>People</th>
                  <th style={{ height: '40px' }}>Status</th>
                  <th style={{ height: '40px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.reservation_id}</td>
                    <td>
                      {`${reservation.first_name} ${reservation.last_name}`} <br />
                      {reservation.mobile_number}
                    </td>
                    <td>{displayDate}</td>
                    <td>{reservation.reservation_time}</td>
                    <td>{reservation.people}</td>
                    <td>{reservation.status}</td>
                    <td>
                    {reservation.status === 'booked' && (
  <div className="d-flex flex-column">
    <Link to={`/reservations/${reservation.reservation_id}/seat`}>
      <button type="button" className="btn btn-outline-info btn-sm mb-2 btn-block">
        Seat
      </button>
    </Link>
    <Link to={`/reservations/${reservation.reservation_id}/edit`}>
    <button type="button" className="btn btn-outline-warning btn-sm mb-2 btn-block">
        Edit
      </button>
    </Link>
    <button
      type="button"
      data-reservation-id-cancel={reservation.reservation_id}
      onClick={() => handleCancelReservation(reservation.reservation_id)}
      className="btn btn-outline-danger btn-sm mb-2 btn-block"
    >
      Cancel
    </button>
  </div>
)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reservations for {displayDate}</p>
          )}
        </section>




        {/* Tables Section - 1/3 width*/}
        <section className="tables-section">
  <h4>   Tables</h4>
  {tables.length > 0 ? (
    <table className="table table-bordered shadow">
      <thead>
        <tr>
          <th style={{ height: '49px', verticalAlign: 'middle' }}>ID</th>
          <th style={{ height: '49px', verticalAlign: 'middle' }}>Table No</th>
          <th style={{ height: '49px', verticalAlign: 'middle' }}>Size</th>
          <th style={{ height: '49px', verticalAlign: 'middle' }}>Status</th>
          <th style={{ height: '49px', verticalAlign: 'middle' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <tr key={table.table_id}>
            <td>{table.table_id}</td>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td>
              {table.reservation_id ? (
                <>Occupied </>
              ) : (
                'Open'
              )}
            </td>
            <td>
              {table.reservation_id && (
                <button
                  type="button"
                  data-table-id-finish={table.table_id}
                  onClick={() => handleFinish(table.table_id, table.reservation_id)}
                  className="btn btn-outline-success btn-sm"
                >
                  Finish
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No tables available</p>
  )}
</section>
    </div>
  </div>
  );
}

export default Dashboard;