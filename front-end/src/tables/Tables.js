import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
//import service from "./tables.service";  // Import service as a default import

const service = require("./tables.service");

function Tables() {

    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState("");
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
            event.preventDefault();

            let size = parseInt(capacity, 10);
            console.log("SIZE: ", size);

        const newTableData = {
            data: {
                table_name: tableName,
                capacity: size,
                reservation_id: null,
            }
        };

        try {
            await service.createTable(newTableData);
            setErrors({});
            //history.goBack();
            history.push("/dashboard");
            }
        catch (error) {
            console.log("error.message:", error.message);
            if (error){
                setErrors({ submit: error.message });
            } else {
                setErrors({submit: "Failed to assign table. Please try again." });
            }
        }
    }

    return (
        <div>
            <h4>Tables Overview</h4>
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">Table Name</label>
                <input 
                    type="type" 
                    id="table_name"
                    name="table_name" 
                    value={tableName} 
                    onChange={(e) => {setTableName(e.target.value)}} 
                    placeholder="Table Name"
                    required
                />
                <label htmlFor="capacity">Table Capacity</label>
                <input 
                    type="number" 
                    id="capacity"
                    name="capacity" 
                    value={capacity} 
                    onChange={(e) => {setCapacity(e.target.value)}} 
                    placeholder="Table Capacity"
                    required
                />
                {/* Display ErrorAlert if there's a submission error */}
                {errors.submit && <ErrorAlert error={{ message: errors.submit }} />}
                <button type="button" onClick={() => history.goBack()}> Cancel </button>
                <button type="submit"> Submit </button>
            </form>
        </div>
    )
}     

export default Tables;  