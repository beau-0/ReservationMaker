const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function createTableAssignment (tableAssignment) {

    const response = await fetch(`${API_BASE_URL}/tables/new`,
    {
      method: 'POST',
      body: JSON.stringify(tableAssignment),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if(!response.ok){
      const errorData = await response.json();
      const errorMessage = errorData.error;
      throw new Error(errorMessage || 'Failed to complete table assignment.');
    }
  
    const responseData = await response.json();
    return responseData.data;
  }

  export { createTableAssignment };