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
      console.log("response json: ", errorData)
      throw new Error(errorData.error.message || 'Failed to create reservation');
    }
  
    const responseData = await response.json();
    return responseData.data;
  }


module.exports = {
    createReservation
}