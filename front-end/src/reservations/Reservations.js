import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const service = require("./reservations.service");

function Reservations () {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [partySize, setPartySize] = useState("");
    const history = useHistory();

    const validateForm = () => {
        const errors = {};
        if (!partySize.trim()) {
            errors.partySize = "Party size is required.";
        } else if (isNaN(partySize) || parseInt(partySize, 10) <= 0) {
            errors.partySize = "Party size must be between 1 and 10.";
        }
        return errors;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newReservation = {
            firstName: firstName, 
            lastName: lastName,
            mobileNumber: mobileNumber,
            reservationDate: reservationDate,
            partySize: partySize,
        };

        try {
            const errors = validateForm();
            if (Object.keys(errors).length === 0) {
                await service.createReservation(newReservation);
                history.push("/dashboard");
              } else {
                // Display validation errors to the user
                console.error("Validation errors: ", errors);
              }
        } catch (error) {
            console.error("Error submitting reservation: ", error)
        }
    }

    return (
        <div>
            <h4>New Reservation</h4>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">Name</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => {setFirstName(e.target.value)}} 
                    placeholder="First Name"
                    required
                />
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => {setLastName(e.target.value)}} 
                    placeholder="Last Name"
                    required
                />
                <label htmlFor="mobileNumber">Contact Number</label>
                <input 
                    type="tel" 
                    id="mobileNumber" 
                    value={mobileNumber} 
                    onChange={(e) => {setMobileNumber(e.target.value)}} 
                    placeholder="Enter your phone number"
                    required
                />
                <label htmlFor="reservationDate">Date of Reservation</label>
                <input 
                    type="date" 
                    id="reservationDate" 
                    value={reservationDate} 
                    onChange={(e) => {setReservationDate(e.target.value)}} 
                    required
                />
                <label htmlFor="partySize">Number of People</label>
                <input 
                    type="number" 
                    id="partySize" 
                    value={partySize}
                    onChange={(e) => {setPartySize(e.target.value)}} 
                    placeholder="Number of people"
                    required
                />
                <Link to="/dashboard">
                    <button type="button">Cancel</button>
                </Link>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Reservations;