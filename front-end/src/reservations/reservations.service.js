const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function createReservation(reservationData) {
  console.log("reservation data: ", reservationData)
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
      const errorMessage = errorData.error;
      throw new Error(errorMessage || 'Failed to create reservation');
    }
  
    const responseData = await response.json();
    return responseData.data;
  }


  export { createReservation };