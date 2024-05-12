import {Link, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import axios from "axios";
import '../index.css';
import { Pie } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import Chart from 'chart.js/auto'
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate } from "react-router-dom";

function Dashboard({name}) {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [activeNavItem, setActiveNavItem] = useState(null);
    const [sortByDate, setSortByDate] = useState('desc');
    const [totalRows, setTotalRows] = useState(0);
    const navigate = useNavigate()

    const fetchData = () => {
        axios.get('http://localhost:3001/')
            .then(res => {
                console.log(res.data);
                setData(res.data);
                const dates = res.data.map(appointment => new Date(appointment.appointment_date));
                setAppointmentDates(dates);
            })
            .catch(err => console.log(err));
    };

    const [pieChartData, setPieChartData] = useState({
        type: 'pie',
        labels: ['Cancelled', 'Confirmed', 'Pending', 'Reschedule', 'Done'],
        datasets: [
            {
                data: [0, 0, 0, 0, 0], // Initialize with zeros
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
                //position: 'bottom',
            },
        ],
    });
    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 15,
                    usePointStyle: true,
                },
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            title: {
                display: true,
                text: "Appointment Summary",
                fontSize: 16,
                color: 'black'
            },
            datalabels: {
                formatter: function (value, context) {
                    return value; 
                },
                color: '#fff'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        const value = context.raw || 0;
                        label += value; 
                        return label;
                    }
                }
            }
        }
    };
                
    const handleNavItemClick = (navItem) => {
        setActiveNavItem(navItem);
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

    useEffect(() => {
        setTotalRows(filteredData.length);
        updatePieChartData(filteredData);
      }, [filteredData]);

    useEffect(() => {
        const filtered = data.filter((user) =>
          Object.entries(user).some(([key, value]) =>
            (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ((key === 'patientname' || key === 'preferred_clinic'|| key === 'age') && typeof value === 'number' && value.toString().includes(searchQuery))
          )
        );
        setFilteredData(filtered);
      }, [searchQuery, data]);

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = data.filter(user =>
            Object.values(user).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                typeof value === 'number' && value.toString().includes(searchQuery)
            )
        );
        setFilteredData(filtered);
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this appointment?");
        if (isConfirmed) {
            // Proceed with the deletion
            axios.delete(`http://localhost:3001/deleteUser/${id}`)
                .then(res => {
                    console.log(res);
                    fetchData();
                })
                .catch(err => console.log(err));
        } else {
            // Do nothing or handle cancellation
        }
    };
    

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const handlePagination = (page) => {
      setCurrentPage(page);
    };

    const updatePieChartData = (data) => {
        if (data && data.length > 0) {
            const countByStatus = {
                Cancelled: 0,
                Confirmed: 0,
                Pending: 0,
                Reschedule: 0,
                Done: 0,
            };

            data.forEach(user => {
                countByStatus[user.status]++;
            });

            const newData = Object.values(countByStatus);
            setPieChartData(prevState => ({
                ...prevState,
                datasets: [{ ...prevState.datasets[0], data: newData }]
            }));
        }
    };
    //date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const [date, setDate] = useState(new Date());
    const handleDateChange = (date) => {
        setDate(date);
    };    

    const handleSortByDate = () => {
        // Toggle sorting order
        const newSortOrder = sortByDate === 'asc' ? 'desc' : 'asc';
        setSortByDate(newSortOrder);
    
        // Sort filtered data based on date
        const sortedData = [...filteredData].sort((a, b) => {
            if (sortByDate === 'asc') {
                return new Date(b.appointment_date) - new Date(a.appointment_date);
            } else {
                return new Date(a.appointment_date) - new Date(b.appointment_date);
            }
        });
    
        // Update the sorted data
        setFilteredData(sortedData);
    };
    

    return (
    <div style={{ display: 'flex', height: 'auto', width:'auto', marginRight:'100px'}}>
            {/* Left column (Menu) */}
          
            <div className="flex-column" style={{ marginRight:'10px', width: '160px', backgroundColor: '#2F539B', paddingRight: '10px', paddingLeft: '15px' , height: 'auto'}} >
                {/* Navigation Menu */}
                
                <h4 style={{ marginTop:'55px',fontSize:'20px', color:'white', marginLeft:'-5px'}}>
                <img src={process.env.PUBLIC_URL + '/menu.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-3px'}} />    MENU</h4>
                
                <div className={`${activeNavItem === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavItemClick('dashboard')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                    <span onClick={() => navigate(`/dashboard/${name}`)} className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', color:'white' }}>
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
                <div class="p-2" style={{ color:'white', fontWeight:'bolder', cursor: 'pointer'}}>Medications</div> 
                <div className={`${activeNavItem === 'profile' ? 'active' : ''}`} onClick={() => handleNavItemClick('profile')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                <span onClick={() => navigate('/profile')} className="btn  btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-140px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/person.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'25px'}} /> My Profile</span>
                </div>*/}
                <div style={{ borderBottom: '1px solid #f0f0f0', width: '110px', marginLeft: '-5px', marginBottom: '10px' }}></div>
                <div className={`${activeNavItem === 'login' ? 'active' : ''}`} onClick={() => handleNavItemClick('login')} style={{ color:'white', marginTop:'110px', cursor: 'pointer'}}>
                <span onClick={() => navigate('/')}className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-200px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/logout.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'40px'}} /> Logout</span>
                </div>
            </div>

        <div>
             {/* Middle column (Main content) */}
                <div className=" justify-content-center align-items-cente" style={{height: '100vh', width: '850px', marginTop:'15px', marginBottom:'5px'}} > 
                    <div className=" bg-white box1 " style={{ width:'auto', flex: '0 0 800px', backgroundColor: '#f0f0f0', height: 'auto', flexDirection: 'column', alignItems: 'center' , borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border:'0.5px outset rgba(126, 124, 124, 0.2)'}}>
                        <div style={{marginBottom:'10px', marginTop:'-12px', alignItems:'center'}}>
                            {/* Logo */}
                                <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginLeft:'-5px'}} />
                            {/* Notification Bell 
                                <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px', marginTop:'8px', marginLeft:'590px', marginRight:'5px' }} />
                             */}{/* User  
                             <Link to="/profile" style={{textDecoration:'none'}} >
                            <img src={process.env.PUBLIC_URL + '/personB.png'} alt="Your Logo" style={{ width: '30px', marginTop:'8px'}} /> </Link>
                            */}
                        </div>
                        <div style={{ position: 'relative', height: '230px', display: 'flex', flexDirection: 'column', color: 'black', padding: '20px' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80%', backgroundImage: `url(${process.env.PUBLIC_URL}/header.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', opacity: '0.7' }}></div>
                            <p style={{ fontSize: '15px', fontFamily: 'Lucida sans', fontWeight: 'bolder', marginBottom: '6px', marginTop: '10px', zIndex: 1 }}>Welcome, Doc!</p>
                            <p style={{ fontSize: '12px', fontFamily: 'Lucida sans', marginBottom: '10px', justifyContent: 'normal', zIndex: 1 }}>
                                We're delighted to have you on board. </p>
                            <p style={{ fontSize: '12px', fontFamily: 'Lucida sans', marginBottom: '10px', justifyContent: 'normal', zIndex: 1 }}>
                                You can use the search bar to find specific patients and manage their appointments. <br />
                                The table below displays essential information about your patients' upcoming appointments. <br />
                                Feel free to add new appointments or update existing ones.
                            </p>
                        </div>
                                                
                        <h2 className="centered-label">APPOINTMENTS</h2> 
                        <form onSubmit={handleSearch} >
                                <div className=" d-flex justify-content-end" >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="form-control"
                                        style={{ width: '90%',  height: '30px', backgroundColor: '#ced6da', fontSize:'12px' }}
                                    />
                                    <button className="btn btn-success btn-sm me-4 " style={{ width: '15%', height: '30px', fontSize: '12px' }}>Search</button>
                                    <div>
                                        <Link to="/create" className="btn btn-primary btn-sm me-4 " style={{ width: '120%', height: '30px', fontSize: '12px', marginLeft:'-18px' }}>Add Patient</Link>
                                    </div>
                                </div>
                            </form>
                            <br></br> 
                            <table className="table">
                                <thead>
                                <tr className="justify-content-center">
                                    <th>Patient Name</th>
                                    <th>Age</th>
                                    <th>Preferred Clinic</th>
                                    <th onClick={handleSortByDate}>Appointment Date  <i className={`fas fa-sort${sortByDate === 'asc' ? '-up' : '-down'}`}></i></th>
                                    <th>Appointment Time</th>
                                    <th>Reason for Consultation</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentData.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.patientname}</td>
                                        <td>{user.age}</td>
                                        <td>{user.preferred_clinic}</td>
                                        <td >{user.appointment_date}</td>
                                        <td>{user.appointment_time}</td>
                                        <td>{user.reason}</td>
                                        <td>{user.status}</td>
                                        <td>{user.note}</td>
                                        <td>
                                        <Link to={`/edit/${user._id}`} className="btn btn-success" style={{ width: '40px', height: '25px', fontSize: '10px', marginLeft: '-2px', paddingLeft: '3px', marginBottom: '3px' }}>
                                            Update
                                        </Link>
                                        <button onClick={() => handleDelete(user._id)} className="btn btn-danger" style={{ width: '40px', height: '25px', fontSize: '10px', marginLeft: '-2px', paddingLeft: '3px' }}>
                                            Delete
                                        </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom:'15px' }}>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                    key={index}
                                    onClick={() => handlePagination(index + 1)}
                                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} btn-sm mx-1`}
                                    style={{ fontSize: '10px' }} 
                                    >
                                    {index + 1}
                                    </button>
                                ))}
                                </div>
                    </div>
                </div>
        </div>
        <div  style={{marginLeft: '20px' }}>
            {/* Right Column 
            <img src={process.env.PUBLIC_URL + '/doc.jpg'} alt="Doctor's Profile" style={{ width: '200px', height: '200px', marginBottom: '10px', borderRadius: '10px', marginTop:'20px'}} />
            */}
             <div class="card mb-4"  style={{padding:'15px', marginBottom: '-10px', marginTop:'15px',width:'320px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <div className="calendar-container">
                    <h5 style={{ marginTop:'-5px'}}>Calendar</h5>
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
                <div class=" mb-2" style={{ marginTop:'-15px',width:'320px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    <div class="card h-100 ">
                        <div class="card-body" style={{ backgroundColor: '#ADD8E6'  }}>
                            <div class="row no-gutters align-items-center">
                                <div class="text-xs font-weight-bold text-black text-uppercase mb-1"> Total Patients</div>
                                <div class="h6 mb-0 font-weight-bold text-gray-800">{totalRows} Patients</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" mb-2" style={{ marginBottom: '20px',width:'320px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    <div className="card h-100">
                        <div className="card-body" style={{ backgroundColor: '#90EE90'  }}>
                            <div className="row no-gutters align-items-center">
                                <div className="text-xs font-weight-bold text-black text-uppercase mb-1">Appointments this week</div>
                                <div className="h6 mb-0 font-weight-bold text-gray-800">
                                    {/* Display the count of appointments for this week */}
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
                            {/*<div className="text-center">
                                <p className="mb-0">Date: {currentDate}</p>
                            </div>*/}
                        </div>
                    </div>
                </div>
                <div class=" mb-2">
                    <div class="card border-left-primary  h-100 ">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div>
                                <Pie
                                    data={pieChartData}
                                    options={options}
                                    style={{ width: '150px', height: '200px' }}
                                />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>             
        </div>
    </div>
            
    );
}

export default Dashboard;