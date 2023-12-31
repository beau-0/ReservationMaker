import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//import ErrorAlert from "../layout/ErrorAlert";

const service = require("./search.service");

function Search() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState(null);
    //const history = useHistory();
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
  
    const handleSearch = async (event) => {
      event.preventDefault();
  
      try {
        const results = await service.phoneSearch(mobileNumber);
  
        setSearchPerformed(true);
  
        if (results.length > 0) {
          setSearchResults(results);
          setError(null);
          setMobileNumber("");
        } else {
          setSearchResults([]);
          setMobileNumber("");
          setError("No reservations found.");
        }
      } catch (error) {
        console.error(error);
        setSearchResults([]);
        setError("An error occurred while searching for reservations.");
      }
    };
  
    return (
      <div>
        <h2>Search Reservations</h2>
        <form onSubmit={handleSearch}>
          <div>
            <label htmlFor="mobileNumber">Enter a customer's phone number:  </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Customer Phone"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit">Find</button>
        </form>
  
        {/* Display search results or "No reservations found" message */}
        {searchPerformed && searchResults.length === 0 && !error && (
          <p style={{ color: "red" }}>No reservations found.</p>
        )}
  
        {/* Additional logic for displaying search results */}
        {searchResults.length > 0 && (
          <div>
            <h3>Search Results</h3>
            {/* Render your search results here */}
          </div>
        )}
  
        {/* Additional logic for handling errors */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }
  
  export default Search;