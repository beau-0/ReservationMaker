const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";


  export const phoneSearch = async (phoneNumber) => {

    try {
        const response = await fetch(`${API_BASE_URL}/search?mobile_number=${phoneNumber}`);

        if (!response.ok) {
            throw new Error(`Error fetching reservations: ${response.status} - ${response.statusText}`);
          }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching tables:", error);
        throw error;
    }
  }
  