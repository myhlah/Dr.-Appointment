import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser(name){

    const [patientname, setPatientname] = useState()
    const [age, setAge] = useState()
    const [gender, setGender]= useState()
    const [email, setEmail] = useState()
    const [preferred_clinic, setPreferred_clinic] = useState()
    const [appointment_date, setAppointment_date]= useState()
    const [appointment_time, setAppointment_time] = useState()
    const [reason, setReason] = useState()
    const [status, setStatus] = useState()
    const [note, setNote] = useState()
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!patientname ||!age || !gender ||!preferred_clinic || !appointment_date || !appointment_time || !reason ||!status || !note ||!email) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }
    
        setErrorMessage("");
    
        axios
            .post("http://localhost:3001/create", { patientname, age, gender, preferred_clinic, appointment_date, appointment_time, reason, status, note, email})
            .then((res) => {
                console.log(res);
                navigate(`/dashboard/${name}`);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center">
            <div className="w-75 bg-white p-4 bordered-container1" style={{ padding: '15px', marginTop: '-20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '0.5px outset rgba(126, 124, 124, 0.2)' }}>
                <form onSubmit={handleSubmit} style={{ margin: '5px' }}>
                    <h2 className="centered-label" style={{ marginTop: '10px' }}>Add Appointment</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-2">
                                <label htmlFor="">Patient Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Patient Name"
                                    className="form-control"
                                    onChange={(e) => setPatientname(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Age</label>
                                <input
                                    type="text"
                                    placeholder="Enter Patient Age"
                                    className="form-control"
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Gender</label>
                                <input
                                    type="text"
                                    placeholder="Enter Gender"
                                    className="form-control"
                                    onChange={(e) => setGender(e.target.value)}
                                />

                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Clinic</label>
                                <input
                                    type="text"
                                    placeholder="Enter Clinic"
                                    className="form-control"
                                    onChange={(e) => setPreferred_clinic(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Appointment Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Date"
                                    className="form-control"
                                    onChange={(e) => setAppointment_date(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Appointment Time</label>
                                <input
                                    type="text"
                                    placeholder="Enter Time"
                                    className="form-control"
                                    onChange={(e) => setAppointment_time(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-2">
                                <label htmlFor="">Email</label>
                                <input
                                    type="text"
                                    placeholder="Enter Email Address"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Reason for Appointment</label>
                                <textarea
                                    type="text"
                                    placeholder="Enter Reason..."
                                    className="form-control"
                                    onChange={(e) => setReason(e.target.value)}
                                    style={{ width: '100%', height:'93px',textAlign: 'left' }}
                                ></textarea>
                            </div>
                            
                            <div className="mb-2">
                                <label htmlFor="">Note</label>
                                <textarea
                                    
                                    placeholder="Enter Note"
                                    className="form-control"
                                    onChange={(e) => setNote(e.target.value)}
                                    style={{ width: '100%' , height:'80px'}}
                                ></textarea>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    className="form-control"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Done">Done</option>
                                    <option value="Reschedule">Reschedule</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {errorMessage && <div className="text-danger mb-2">{errorMessage}</div>}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success me-2" style={{ width: "100px", height: "30px", fontSize: "12px" }} onClick={handleSubmit}>
                            Submit
                        </button>
                        <button className="btn btn-secondary me-2" style={{ width: "100px", height: "30px", fontSize: "12px" }} onClick={() => navigate(`/dashboard/${name}`)}>
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUser;
