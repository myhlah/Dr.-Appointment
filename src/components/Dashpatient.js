import {Link, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import axios from "axios";
import '../index.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'





function Dashpatient() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(new Date());

    const handleDateChange = (date) => {
        setDate(date);
    };


      useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        axios.get('http://localhost:3001/')
        .then(res => {
            console.log("http://localhost:3001/", res.data);
            setData(res.data);
            if (res.data && res.data.appointments) {
                setAppointments(res.data.appointments);
            } else {
                setAppointments([]);
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
    };

    const fetchData = () => {
        axios.get('http://localhost:3001/')
            .then(res => {
                console.log(res.data);
                setData(res.data);
                if (res.data && res.data.appointments) {
                    setAppointments(res.data.appointments);
                } else {
                    setAppointments([]);
                }
            })
            .catch(err => console.log(err));
    };
    
        

    return (
    <div style={{ display: 'flex', height: '850px'}}>

    <div>
         {/* Middle column (Main content) */}
        <div className="boxe justify-content-center align-items-cente" style={{ width: '100%', height: 'auto', marginTop:'10px'}} > 
            <div className=" box1 " style={{ backgroundColor: '#f0f0f0',marginLeft:'20px', marginRight:'15px', height:'815px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'}}  >
                <div style={{marginBottom:'20px', marginTop:'-15px', alignItems:'center'}}>
                    {/* Logo */}
                        <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px'}} />
                    {/* Notification Bell */}
                        <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px', marginLeft: '450px' }} />
                        <Link to="/" className="btn btn-primary btn-sm" style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '15px'}}>Logout</Link>
                    
                </div>
                <div style={{ position: 'relative', height: '230px', display: 'flex', flexDirection: 'column'}}>
                        <img src={process.env.PUBLIC_URL + '/doc.jpg'} alt="Doctor's Profile" style={{ width: '200px', marginLeft:'270px', height: '200px', marginBottom: '10px', borderRadius: '10px', marginTop: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' }} />
                        <h3 className="text-primary" style={{ marginBottom: '-3px',marginLeft:'290px' }}>Sarah Johnson</h3>
                        <p style={{  marginBottom: '-3px', marginLeft:'350px', fontSize: '15px', fontWeight:'bolder',color:'GrayText' }}>Female</p>
                        <p style={{ marginBottom: '30px', marginLeft:'330px', fontSize: '15px', fontWeight:'bolder',color:'GrayText'  }}>51 years old</p>
                        <div>
                            <p style={{ marginBottom: '5px',marginLeft:'30px' }}><b>Medical History: </b>
                            <ul style={{marginBottom:'2px'}}> - Has a history of hypertension (high blood pressure) diagnosed five years ago. She manages this condition with regular medication and lifestyle modifications.</ul>
                            <ul style={{marginBottom:'2px'}}> - Underwent a hysterectomy ten years ago due to fibroid tumors.</ul>
                            <ul style={{marginBottom:'2px'}}> - Has a family history of heart disease, with her father experiencing a heart attack in his late 50s.</ul>
                            <ul style={{marginBottom:'2px'}}> - Experiences occasional joint stiffness, particularly in her knees, which she attributes to aging and previous sports injuries.</ul>
                            </p>
    
                            <div style={{ borderBottom: '2px solid #2F539B', opacity:'0.45', width:'720px', marginLeft:'30px', marginBottom:'20px',marginTop:'20px' }}></div>
                            <p style={{ marginBottom: '-3px',marginLeft:'30px' }}><b>Medications:</b> 
                            <ul style={{marginBottom:'2px'}}> - Lisinopril (10 mg daily) for hypertension</ul>
                            <ul style={{marginBottom:'2px'}}> - Calcium and Vitamin D supplements for bone health</ul>
                            </p>
                        </div>
                </div>         
            </div>
        </div>
    </div>
    <div style={{ flex: '0 0 250px',marginLeft:'30px',marginBottom:'20px', backgroundColor: '#f0f0f0', paddingTop: '10px', paddingLeft:'-10px',paddingRight:'5px', marginTop: '15px', height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' , borderRadius: '20px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'}}>
        <h5 style={{ borderBottom: '2px solid black', marginBottom:'2px', width:'350px', marginTop: '3px' }}>
            My Appointments
            <Link to="/book" className="btn btn-primary btn-sm me-4 " style={{ width: '150px', height: '30px', fontSize: '12px', marginLeft:'12px' , marginBottom:'2px'  }}>Book an appointment</Link>
        </h5>
        
        <div style={{ borderBottom: '2px solid black', marginBottom:'2px' }}></div>
        <table style={{ width: '360px', fontSize:'12px'}}>
            {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                        <tr key={index}>
                            <td>{appointment.appointment_date}</td>
                            <td>{appointment.appointment_time}</td>
                            <td>{appointment.preferred_clinic}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No appointments</td>
                    </tr>
                )} 
        </table>
        <div class="card mb-4"  style={{padding:'20px', marginBottom: '10px', marginTop:'170px',width:'400px', borderRadius: '20px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' }}>
            <div className="calendar-container">
                <h5 style={{ marginTop:'-5px'}}>Calendar</h5>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="custom-calendar"
                />
            </div>
        </div>
        
            

    </div>
</div>
        
);
}

export default Dashpatient;