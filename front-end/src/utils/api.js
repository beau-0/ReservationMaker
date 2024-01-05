/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// TABLES SERVICE FILES
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
export async function fetchTables(params, signal) {   
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
export async function fetchReservations(params, signal) {   
}

const finishTable = async (tableId) => {
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
export async function finishTable(params, signal) {   
}

const updateReservationStatus = async (reservationId, status) => {
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
export async function updateReservationStatus(params, signal) {   
}

// RESERVATIONS SERVICE FILES
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
export async function createReservation(params, signal) {   
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
export async function assignTable(params, signal) {   
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
export async function listTables(params, signal) {   
}

//DASHBOARD
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
export async function fetchTables(params, signal) {   
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
export async function fetchReservations(params, signal) {   
}

async function finishTable (tableId) {
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
export async function finishTable(params, signal) {   
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
export async function updateReservationStatus(params, signal) {   
}
