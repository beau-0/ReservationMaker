import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getReservation, updateReservation } from '../utils/api';

function Edit() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [errors, setErrors] = useState({});
    const [reservation, setReservation] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 1, // Set default value or fetch from reservationData
      });

    useEffect(() => {
        const fetchReservation = async () => {
          try {
            const reservationData = await getReservation(reservation_id);
            setReservation({
                first_name: reservationData.first_name,
                last_name: reservationData.last_name,
                mobile_number: reservationData.mobile_number,
                reservation_date: reservationData.reservation_date,
                reservation_time: reservationData.reservation_time,
                people: reservationData.people,
              });

          } catch (error) {
            console.error('Error loading reservation data:', error);
            setErrors(error.message);
          }
        };
        fetchReservation();
      }, [reservation_id]);

      const handleChange = (event) => {
        const { name, value } = event.target;
        setReservation((prevReservation) => ({
          ...prevReservation,
          [name]: value,
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        // Add logic to update reservation based on form data
        try {
          await updateReservation(reservation_id, reservation);
          // Redirect to previous page
          history.goBack();
        } catch (error) {
          console.error('Error updating reservation:', error);
          setErrors(error.message);
        }
      };
      
      const handleCancel = () => {
        // Redirect to previous page
        history.goBack();
      };

      return (
        <div>
          <h1>Edit Reservation</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={reservation.first_name}
              onChange={handleChange}
            />
            {/* Add other form fields here... */}
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      );
}

export default Edit;