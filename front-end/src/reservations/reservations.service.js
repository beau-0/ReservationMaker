const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function createReservation(reservationData) {
    const response = await fetch(`${API_BASE_URL}/reservations/new`,
    {
      method: 'POST',
      body: JSON.stringify(reservationData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if(!response.ok){
      const errorData = await response.json();
      console.log(errorData);
      const errorMessage = errorData.error;
      throw new Error(errorMessage || 'Failed to create reservation');
    }
  
    const responseData = await response.json();
    return responseData.data;
  }

async function assignTable (table_id, reservation_id) {
  const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        table_id: table_id,
        reservation_id: reservation_id,
      },
    }),
  });

  if(!response.ok){
    const errorData = await response.json();
    console.log(errorData);
    const errorMessage = errorData.error;
    throw new Error(errorMessage || 'Failed to assign table.');
  }

  const responseData = await response.json();
  return responseData.data;
}

async function listTables() {
  let date = '2025-12-01';
  try {
      const response = await fetch(`${API_BASE_URL}/dashboard?date=${date}`);
      if (!response.ok) {
          throw new Error("Failed to fetch tables.");
      }
      const data = await response.json();
      console.log("tables front: ", data.tables);
      return data.tables;
  } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
  }
}


export { createReservation };
export { assignTable };
export { listTables };