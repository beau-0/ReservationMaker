const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function fetchTables(date) {
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

async function fetchReservations(date) {
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

const finishTable = async (tableId) => {
    console.log("asdf", tableId)
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
};



module.exports = {
    fetchTables,
    fetchReservations,
    finishTable
    };