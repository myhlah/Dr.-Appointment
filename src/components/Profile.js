import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Chart from 'chart.js/auto';
import '../index.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [data, setData] = useState([]);
    const [activeNavItem, setActiveNavItem] = useState(null);
    const chartRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const navigate = useNavigate();

    const fetchData = () => {
        axios.get('http://localhost:3001/')
            .then(res => {
                console.log(res.data);
                setData(res.data);
                const dates = res.data.map(appointment => new Date(appointment.appointment_date));
                setAppointmentDates(dates);
                
                // Filter user data based on the logged-in user's ID
            const loggedInUser = res.data.find(user => user._id === id);
            if (loggedInUser) {
                setName(loggedInUser.name); // Assuming 'name' is the property containing the user's name
            }
            })
            .catch(err => console.log(err));
    };

    const [appointmentDates, setAppointmentDates] = useState([]);
      useEffect(() => {
        fetchData();
    }, []);

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleNavItemClick = (navItem) => {
        setActiveNavItem(navItem);
    };

    useEffect(() => {
        fetchData();
            const interval = setInterval(() => {
            const date = new Date();
            const formattedDate = formatDate(date);
            setCurrentTime(formattedDate);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        createChart();
    }, [filteredData]);


    useEffect(() => {
        const filtered = data.filter((user) =>
            Object.entries(user).some(([key, value]) =>
                (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ((key === 'patientname' || key === 'preferred_clinic' || key === 'age') && typeof value === 'number' && value.toString().includes(searchQuery))
            )
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    // Function to get the ISO week number for a date
    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNumber;
    }
    const createChart = () => {
        if (!chartRef.current || !filteredData.length) return;
    
        const ctx = chartRef.current.getContext('2d');
        const labels = ['Cancelled', 'Confirmed', 'Pending', 'Reschedule', 'Done'];
        let counts = [0, 0, 0, 0, 0]; // Initialize with zeros
    
        // Count the number of appointments for each status
        filteredData.forEach(appointment => {
            if (appointment.status === 'Cancelled') counts[0]++;
            else if (appointment.status === 'Confirmed') counts[1]++;
            else if (appointment.status === 'Pending') counts[2]++;
            else if (appointment.status === 'Reschedule') counts[3]++;
            else if (appointment.status === 'Done') counts[4]++;
        });
    
        // Sort counts based on the selected value
        if (sortBy === 'year') {
            // Sort by year logic
            const appointmentsByYear = {};
            filteredData.forEach(appointment => {
                const year = appointment.appointment_date.getFullYear();
                appointmentsByYear[year] = (appointmentsByYear[year] || 0) + 1;
            });
    
            // Update counts with sorted values
            labels.forEach((label, index) => {
                counts[index] = appointmentsByYear[label] || 0;
            });
        } else if (sortBy === 'month') {
            // Sort by month logic
            const appointmentsByMonth = {};
            filteredData.forEach(appointment => {
                const month = appointment.appointment_date.getMonth(); // Month is zero-indexed
                appointmentsByMonth[month] = (appointmentsByMonth[month] || 0) + 1;
            });
    
            // Update counts with sorted values
            labels.forEach((label, index) => {
                counts[index] = appointmentsByMonth[label] || 0;
            });
        } else if (sortBy === 'week') {
            // Sort by week logic
            const appointmentsByWeek = {};
            filteredData.forEach(appointment => {
                const week = getWeekNumber(appointment.appointment_date);
                appointmentsByWeek[week] = (appointmentsByWeek[week] || 0) + 1;
            });
    
            // Update counts with sorted values
            labels.forEach((label, index) => {
                counts[index] = appointmentsByWeek[label] || 0;
            });
        }
    
        // Destroy existing chart if it exists
        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }
    
        // Create new chart
        chartRef.current.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Appointments by Status',
                    data: counts,
                    fill: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        });
    };
    
    
    

    

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ display: 'flex', height: 'auto', width: 'auto', marginRight: '100px' }}>
            {/* Left column (Menu) */}

            <div className="flex-column" style={{ marginRight:'10px', width: '160px', backgroundColor: '#2F539B', paddingRight: '10px', paddingLeft: '15px' , height: 'auto'}} >
                {/* Navigation Menu */}
                
                <h4 class="font-weight-bold border-bottom"  style={{ marginTop:'55px',fontSize:'20px', color:'white', marginLeft:'-5px'}}>
                <img src={process.env.PUBLIC_URL + '/menu.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-3px'}} />    MENU</h4>
                
                <div className={`${activeNavItem === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavItemClick('dashboard')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                    <span onClick={() => navigate('/dashboard/${name}')} className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', color:'white' }}>
                    <img src={process.env.PUBLIC_URL + '/dash.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'20px'}} />  Dashboard</span>
                </div>
                <div className={`${activeNavItem === 'appointments' ? 'active' : ''}`} onClick={() => handleNavItemClick('appointments')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                    <span onClick={() => navigate('/appointments')}  className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-80px', color:'white'  }}>
                    <img src={process.env.PUBLIC_URL + '/calendar.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'5px'}} /> Appointments</span>
                </div>
                {/*<div className={` ${activeNavItem === 'patients' ? 'active' : ''}`} onClick={() => handleNavItemClick('patients')} style={{ color:'white', fontWeight:'bolder', marginTop:'50px', cursor: 'pointer'}}>
                <Link to="/patients" className="btn btn-primary btn-sm" style={{ width: '120%', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-140px' }}>Patients</Link>
                </div>
                 <div class="p-2" style={{ color:'white', fontWeight:'bolder', cursor: 'pointer'}}>Messages</div>
                <div class="p-2" style={{ color:'white', fontWeight:'bolder', cursor: 'pointer'}}>Medications</div> */}
                <div className={`${activeNavItem === 'profile' ? 'active' : ''}`} onClick={() => handleNavItemClick('profile')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                <span onClick={() => navigate('/profile')} className="btn  btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-140px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/person.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'25px'}} /> My Profile</span>
                </div>
                <div className={`${activeNavItem === 'login' ? 'active' : ''}`} onClick={() => handleNavItemClick('login')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                <span onClick={() => navigate('/')}className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-200px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/logout.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'40px'}} /> Logout</span>
                </div>
            </div>

            <div>
                {/* Middle column (Main content) */}
                <div className=" justify-content-center align-items-cente" style={{ width: '920px', height: '410px', marginTop: '15px', marginLeft: '15px', marginRight: '-5px' }} >
                    <div className=" bg-white box1 " style={{ width: '800px', flex: '0 0 800px', backgroundColor: '#f0f0f0', height: '620px', flexDirection: 'column', alignItems: 'center', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '0.5px outset rgba(126, 124, 124, 0.2)' }}>
                        <div style={{ marginBottom: '10px', marginTop: '-12px', alignItems: 'center' }}>
                            {/* Logo */}
                            <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginLeft: '-5px' }} />
                            {/* Notification Bell */}
                            <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px', marginTop: '8px', marginLeft: '520px', marginRight: '5px' }} />
                            {/* User  */}
                            <Link to="/profile" style={{ textDecoration: 'none' }} >
                                <img src={process.env.PUBLIC_URL + '/personB.png'} alt="Your Logo" style={{ width: '30px', marginTop: '8px' }} /> </Link>

                        </div>
                        <div style={{ position: 'relative', height: '230px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', height: '240px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgb(205, 210, 212)', marginBottom:'20px' , marginLeft:'-20px', marginRight:'-20px'}}>
                                <img src={process.env.PUBLIC_URL + '/doc.jpg'} alt="Doctor's Profile" style={{ width: '200px', marginLeft: '50px', height: '200px', marginBottom: '10px', borderRadius: '5px', marginTop: '50px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' }} />
                                <h3 className="text-primary" style={{ marginBottom: '-3px', marginLeft: '270px', marginTop:'-80px' }}>John Doe</h3>
                                <h5 style={{ marginBottom: '-3px', marginLeft: '400px', marginTop:'-24px' }}> Internal Medicine and Neurology</h5>
                                <p style={{ marginLeft: '270px', marginTop:'10px' }}><b>johndoe@gmail.com</b></p>
                                <p style={{ marginBottom: '30px', marginLeft: '405px', marginTop:'-32px' }}> <b>0912-345-6789</b></p>
                            </div>    
                                
                            
                            <div>
                                <p style={{ marginBottom: '5px', marginLeft: '30px' }}><b>Professional Info: </b><br></br>Dr. John Doe is in the field of Internal Medicine and Neurology. Treats patients at Mercy Hospital and Sanitarium Hospital.</p>
                                <div style={{ borderBottom: '2px solid #2F539B', opacity: '0.45', width: '700px', marginLeft: '30px', marginBottom: '20px' }}></div>
                                <div style={{ marginTop: '-10px', marginLeft: '450px' }}>
                                    <p style={{ marginBottom: '-3px', marginLeft: '30px' }}><b>Clinics:</b>
                                        <ul style={{ marginBottom: '2px' }}>Mercy Hospital</ul>
                                        <ul>Sanitarium Hospital</ul>
                                    </p>
                                </div>
                                
                                <div style={{ marginTop: '-70px', marginLeft: '80px' }}>
                                <p style={{ marginBottom: '-3px', marginLeft: '30px' }}><b>Schedule:</b></p>
                                        <table style={{ width: '360px', fontSize:'12px'}}>
                                                <tr style={{ width: '300px', fontSize:'12px'}}> 
                                                    <td></td>
                                                    <td><h6>Mercy</h6></td>
                                                    <td><h6>Sanitarium</h6></td>
                                                </tr>
                                                <tr>Monday
                                                    <td>10:00 AM - 12:00 PM </td>
                                                    <td>10:00 AM - 12:00 PM </td>
                                                </tr>
                                                <tr>Tuesday
                                                    <td>10:00 AM - 12:00 PM </td>
                                                    <td>10:00 AM - 12:00 PM </td>
                                                </tr>
                                                <tr>Wednesday
                                                    <td>10:00 AM - 12:00 PM </td>
                                                    <td>10:00 AM - 12:00 PM </td>
                                                </tr>
                                                <tr>Thrursday
                                                    <td>10:00 AM - 12:00 PM </td>
                                                    <td>No Schedule </td>
                                                </tr>
                                                <tr>Friday
                                                    <td>10:00 AM - 12:00 PM</td>
                                                    <td>No Schedule </td>
                                                </tr>
                                                <tr>Saturday
                                                    <td>No Schedule </td>
                                                    <td>No Schedule </td>
                                                </tr>
                                                <tr>Sunday
                                                        <td>No Schedule </td>
                                                        <td>No Schedule </td>
                                                </tr>        
                                        </table>
                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: '0 0 250px', marginLeft: '-90px', marginBottom: '10px', marginTop: '15px' }}>

                <div className="w-100 ">
                    <div className="card h-100">
                        <div className="card-body" style={{ backgroundColor: '#9cd0fb', height: '80px' }}>
                            <div className="row no-gutters align-items-center">
                                <div className="text-xs font-weight-bold text-black text-uppercase mb-1">Appointments this week</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {filteredData.filter(user => {
                                        // Get today's date
                                        const today = new Date();
                                        // Calculate the start date of the current week (Sunday)
                                        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                                        // Calculate the end date of the current week (Saturday)
                                        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
                                        // Convert appointment date to Date object
                                        const appointmentDate = new Date(user.appointment_date);
                                        // Check if the appointment date falls within the current week
                                        return appointmentDate >= startDate && appointmentDate <= endDate;
                                    }).length} Appointments

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card " style={{ padding: '15px', marginBottom: '5px', marginTop: '10px', width: '350px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '0.5px outset rgba(126, 124, 124, 0.2)' }}>
                    <div className="calendar-container">
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        className="custom-calendar"
                        tileContent={({ date }) => {
                            // Check if the current date has an appointment
                            const hasAppointment = appointmentDates.some(appointmentDate => isSameDay(date, appointmentDate));
                            // Render a dot if the date has an appointment
                            return hasAppointment ? <div className="appointment-dot"></div> : null;
                        }}
                    />
                    </div>
                </div>
                <div class="card " style={{ marginTop: '10px', width: '350px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '0.5px outset rgba(126, 124, 124, 0.2)' }}>
                <div style={{ marginBottom:'-10px'}}>
                {/*<select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ marginBottom: '-10px', marginTop: '5px', width: '50px', marginLeft: '295px', border: '0.5px outset rgba(126, 124, 124, 0.2)' }}
                >
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    </select>*/}

                </div>
                    <div class="card-body" style={{ padding:'2px', marginTop:'15px'}}>
                        <canvas ref={chartRef}></canvas></div>
                    <div class="card-footer small text-muted">Updated {currentTime}</div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
