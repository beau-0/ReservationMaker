import React, { useState, useEffect } from "react";
//import { listTables } from "../utils/api";
import { useHistory, useParams, useQuery } from "react-router-dom";
import { assignTable, listTables }  from "./reservations.service";

function SeatReservationPage() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [errors, setErrors] = useState();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await listTables();
        setTables(tablesData);
      } catch (error) {
        console.error("Error loading tables data:", error);
        // Handle error as needed
      }
    };
    setErrors();
    fetchTables();
  }, []);

  const handleTableSelect = (event) => {
    const selectedTableId = event.target.value;
    setSelectedTable(selectedTableId);
  };

  const handleSeatReservation = async () => {
    try {
    await assignTable(selectedTable, reservation_id);
    history.push("/dashboard");
    } catch (error) {
        console.error("Error assigning table:", error);
        setErrors("Failed to assign table. Please try again.");
    }
  };

  const handleCancel = () => {
    // Redirect to the dashboard
    history.push("/dashboard");
  };

  return (
    <div>
      <h1>Seat Reservation</h1>
      <label htmlFor="tableSelect">Select a Table:</label>
      <select id="tableSelect" onChange={handleTableSelect} value={selectedTable || ""}>
        <option value="" disabled>Select a table</option>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - Capacity: {table.capacity}
          </option>
        ))}
      </select>
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSeatReservation} disabled={!selectedTable}>
        Seat Reservation
      </button>
    </div>
  );
}

export default SeatReservationPage;