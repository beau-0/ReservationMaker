const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function createReservation(reservationData) {
  console.log("ZYX: ", reservationData)
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
    console.log("XXX: ", responseData)
    return responseData.data;
  }

async function assignTable (table_id, reservation_id) {
  console.log("HGH: ", table_id, reservation_id);
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

async function editReservation(reservation_id, reservationData) {

  const response = await fetch(`${API_BASE_URL}/reservations/${reservation_id}`,
  {
    method: 'PUT',
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

async function updateReservationStatus (reservationId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          status,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to update reservation status: ${error.message}`);
  }
};



export { createReservation };
export { assignTable };
export { listTables };
export { editReservation };
export { updateReservationStatus };
