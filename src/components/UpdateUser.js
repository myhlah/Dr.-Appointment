import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateUser({ name }){

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [preferred_clinic, setPreferred_clinic] = useState()
    const [appointment_date, setAppointment_date] = useState()
    const [appointment_time, setAppointment_time] = useState()
    const [reason, setReason] = useState()
    const [status, setStatus] = useState()
    const [note, setNote]= useState()
    

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`http://localhost:3001/get/${id}`);
                console.log(response);
                setUser(response.data);
                setPreferred_clinic(response.data.preferred_clinic)
                setAppointment_date(response.data.appointment_date)
                setAppointment_time(response.data.appointment_time)
                setReason(response.data.reason)
                setStatus(response.data.status)
                setNote(response.data.note)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [id]);

    const navigate = useNavigate()

    const handleUpdate = (e) => {
        e.preventDefault();
        axios
          .put("http://localhost:3001/update/" + id, { preferred_clinic, appointment_date, appointment_time, reason, status, note})
          .then((res) => {
            console.log(res);
            navigate(`/dashboard/${name}`) ;
          })
          .catch((err) => console.log(err));
      };

    return (
        <div className="d-flex vh-100  justify-content-center align-items-center">
            <div className="w-50 bg-white  p-4 bordered-container1 "  style={{padding:'15px', marginTop:'-20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border:'0.5px outset rgba(126, 124, 124, 0.2)'}}>
            <form onSubmit={handleUpdate} style={{margin:'5px'}}>
                    <h2 className="centered-label" style={{ marginTop:'10px'}}>Reschedule Appointment</h2>
                        <h5 style={{fontSize:'15px'}}>Patient Info: </h5>
                        {user && (
                            <div>
                                <p style={{fontSize:'13px', marginBottom:'2px', marginLeft:'50px', fontWeight:'bold'}}>Name: {user.patientname}</p>
                                <p style={{fontSize:'12px', marginBottom:'2px', marginLeft:'50px', fontWeight:'bold'}}>Age: {user.age}</p>
                                <p style={{fontSize:'12px', marginBottom:'10px', marginLeft:'50px', fontWeight:'bold'}}>Gender: {user.gender}</p>
                            </div>
                        )}

                    <div className="mb-2">
                        <label htmlFor= "">Clinic</label>
                        <input
                            type="text"
                            placeholder={preferred_clinic}
                            className="form-control"
                            onChange={(e) => setPreferred_clinic(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                    <label htmlFor= "">Appointment Date</label>
                    <input
                        type="date"
                        placeholder={appointment_date}
                        className="form-control"
                        onChange={(e) => setAppointment_date(e.target.value)}
                    />
                    </div>
                    <div className="mb-2">
                        <label htmlFor= "">Appointment Time</label>
                        <input
                            type="email"
                            placeholder={appointment_time}
                            className="form-control"
                            onChange={(e) => setAppointment_time(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                    <label htmlFor= "">Reason</label>
                    <input
                        type="text"
                        placeholder={reason}
                        className="form-control"
                        onChange={(e) => setReason(e.target.value)}
                    />
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

                    <div className="mb-2">
                    <label htmlFor= "">Note</label>
                    <input
                        type="text"
                        placeholder={note}
                        className="form-control"
                        onChange={(e) => setNote(e.target.value)}
                    />
                   </div>
                   <div className="d-flex justify-content-between">
                        <button className="btn btn-success me-2" style={{ width: "100px", height: "30px", fontSize: "12px" }}>
                        Update
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

export default UpdateUser;