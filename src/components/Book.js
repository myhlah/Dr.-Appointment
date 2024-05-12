import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Book(){

    const [patientname, setPatientname] = useState()
    const [age, setAge] = useState()
    const [contactnum, setContactnum] = useState()
    const [preferred_clinic, setPreferred_clinic] = useState()
    const [appointment_date, setAppointment_date]= useState()
    const [appointment_time, setAppointment_time] = useState()
    const [reason, setReason] = useState()
    const [errorMessage, setErrorMessage] = useState("")

    
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!patientname || !age || !contactnum || !preferred_clinic || !appointment_date || !appointment_time || !reason) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        setErrorMessage("");

        axios.post("http://localhost:3001/create", { patientname, age, contactnum, preferred_clinic, appointment_date, appointment_time, reason })
            .then((res) => {
                console.log(res);
                setPatientname("");
                setAge("");
                setContactnum("");
                setPreferred_clinic("");
                setAppointment_date("");
                setAppointment_time("");
                setReason("");
                navigate("/dashpatient", { replace: true }); // Navigate to dashpatient without pushing to history
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="d-flex vh-100  justify-content-center align-items-center" style={{backgroundColor:'rgb(199, 225, 234)'}}>
            <div className="w-50 bg-white  p-4 bordered-container1 ">
                <form onSubmit={handleSubmit} style={{margin:'5px'}}>
                    <h2 className="centered-label">Add Appointment</h2>
                    <div className="mb-2">
                        <label htmlFor= "">Patient Name</label>
                        <input
                            type="text"
                            placeholder="Enter Patient Name"
                            className="form-control"
                            onChange={(e) => setPatientname(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor= "">Age</label>
                        <input
                            type="text"
                            placeholder="Enter Age"
                            className="form-control"
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor= "">Contact Number</label>
                        <input
                            type="text"
                            placeholder="09************"
                            className="form-control"
                            onChange={(e) => setContactnum(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                    <label htmlFor= "">Clinic</label>
                    <input
                        type="text"
                        placeholder="Enter Clinic"
                        className="form-control"
                        onChange={(e) => setPreferred_clinic(e.target.value)}
                    />
                    </div>
                    <div className="mb-2">
                    <label htmlFor= "">Appointment Date</label>
                    <input
                        type="text"
                        placeholder="Enter Date"
                        className="form-control"
                        onChange={(e) => setAppointment_date(e.target.value)}
                    />
                    </div>
                    <div className="mb-2">
                        <label htmlFor= "">Appointment Time</label>
                        <input
                            type="text"
                            placeholder="Enter Time"
                            className="form-control"
                            onChange={(e) => setAppointment_time(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                    <label htmlFor= "">Reason</label>
                    <input
                        type="text"
                        placeholder="Write the Reason for Consultation"
                        className="form-control"
                        onChange={(e) => setReason(e.target.value)}
                    />
                   </div><br></br>
                    {errorMessage && <div className="text-danger mb-2">{errorMessage}</div>}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success me-2" style={{ width: "100px", height: "30px", fontSize: "12px" }} onClick={handleSubmit}>
                            Submit
                        </button>
                        <button className="btn btn-secondary me-2" style={{ width: "100px", height: "30px", fontSize: "12px" }} onClick={() => navigate("/dashpatient")}>
                            Back
                        </button>
                    </div>
                </form>
             </div>
        </div>
    )
}

export default Book;