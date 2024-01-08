const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

export async function fetchTables(date) {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard?date=${date}`);

        if (!response.ok) {
            throw new Error("Failed to fetch tables.");
        }
        const data = await response.json();
        return data.tables;
    } catch (error) {
        console.error("Error fetching tables:", error);
        throw error;
    }
}

export async function fetchReservations(date) {
  try {
      const response = await fetch(`${API_BASE_URL}/dashboard?date=${date}`);
      if (!response.ok) {
          console.error("Error fetching reservations:", response.json());
          throw new Error("Failed to fetch reservations.");
      }
      const data = await response.json();
      return data.reservations;
  } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
  }
}

export const finishTable = async (tableId) => {
  console.log("Finish?", tableId)
  try {
    const response = await fetch(`${API_BASE_URL}/tables/${tableId}/seat`, {
      method: 'DELETE',
    });
    console.log("hitting front service file");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Failed to finish table: ${error.message}`);
  }
}

export const updateReservationStatus = async (reservationId, status) => {
  console.log("JKL: ", `${API_BASE_URL}/reservations/${reservationId}/status`);
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

