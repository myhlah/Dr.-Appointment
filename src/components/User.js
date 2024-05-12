import {Link, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import axios from "axios";
import '../index.css';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto'



function Users() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [activeNavItem, setActiveNavItem] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const [pieChartData, setPieChartData] = useState({
        labels: ['Cancelled', 'Confirmed', 'Pending', 'Reschedule', 'Done'],
        datasets: [
            {
                label: 'Appointments by Status',
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
            },
        ],
    });
    const handleNavItemClick = (navItem) => {
        setActiveNavItem(navItem);
      };

      useEffect(() => {
        fetchData();
    }, []);

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

    const fetchData = () => {
        axios.get('http://localhost:3001/')
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch(err => console.log(err));
    };
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
        axios.delete(`http://localhost:3001/deleteUser/${id}`)
            .then(res => {
                console.log(res);
                fetchData();
            })
            .catch(err => console.log(err));
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

    return (
        <div style={{ display: 'flex', height: 'auto', width:'auto', marginRight:'100px'}}>
             {/* Left column (Menu) */}
          
         <div className="flex-column" style={{ marginRight:'10px', width: '160px', backgroundColor: '#2F539B', paddingRight: '10px', paddingLeft: '15px' , height: 'auto'}} >
                {/* Navigation Menu */}
                
                <h4 class="font-weight-bold border-bottom"  style={{ marginTop:'55px',fontSize:'20px', color:'white', marginLeft:'-5px'}}>
                <img src={process.env.PUBLIC_URL + '/menu.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-3px'}} />    MENU</h4>
                
                <div className={`${activeNavItem === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavItemClick('dashboard')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                    <Link to="/dashboard" className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', color:'white' }}>
                    <img src={process.env.PUBLIC_URL + '/dash.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'20px'}} />  Dashboard</Link>
                </div>
                <div className={`${activeNavItem === 'appointments' ? 'active' : ''}`} onClick={() => handleNavItemClick('appointments')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                    <Link to="/appointments" className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-80px', color:'white'  }}>
                    <img src={process.env.PUBLIC_URL + '/calendar.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'5px'}} /> Appointments</Link>
                </div>
                {/*<div className={` ${activeNavItem === 'patients' ? 'active' : ''}`} onClick={() => handleNavItemClick('patients')} style={{ color:'white', fontWeight:'bolder', marginTop:'50px', cursor: 'pointer'}}>
                <Link to="/patients" className="btn btn-primary btn-sm" style={{ width: '120%', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-140px' }}>Patients</Link>
                </div>
                 <div class="p-2" style={{ color:'white', fontWeight:'bolder', cursor: 'pointer'}}>Messages</div>
                <div class="p-2" style={{ color:'white', fontWeight:'bolder', cursor: 'pointer'}}>Medications</div> */}
                <div className={`${activeNavItem === 'profile' ? 'active' : ''}`} onClick={() => handleNavItemClick('profile')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                <Link to="/profile" className="btn  btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-140px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/person.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'25px'}} /> My Profile</Link>
                </div>
                <div className={`${activeNavItem === 'login' ? 'active' : ''}`} onClick={() => handleNavItemClick('login')} style={{ color:'white', marginTop:'50px', cursor: 'pointer'}}>
                <Link to="/" className="btn btn-sm " style={{ width: '120px', height: '30px', fontSize: '12px', marginLeft: '-18px', marginTop: '-200px', color:'white'  }}>
                <img src={process.env.PUBLIC_URL + '/logout.png'} alt="Your Logo" style={{ width: '15px', marginTop:'-1px', marginRight:'40px'}} /> Logout</Link>
                </div>
            </div>

        <div>
             {/* Middle column (Main content) */}
            <div className="boxe justify-content-center align-items-cente" style={{ width: '100%', height: 'auto', marginTop:'-10px'}} > 
                <div className=" bg-white box1 " >
                    <div style={{marginBottom:'20px', marginTop:'-15px', alignItems:'center'}}>
                        {/* Logo */}
                            <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginLeft:'15px'}} />
                        {/* User Name */}
                        <span style={{fontWeight: 'bold', marginLeft:'60%', marginRight:'25px', fontSize:'15px' }}><Link to="/profile" style={{textDecoration:'none'}} >Dr. John Doe</Link></span>
                        {/* Notification Bell */}
                            <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px' }} />
                        
                    </div>
                    <div style={{ position: 'relative', height: '230px', display: 'flex', flexDirection: 'column', color: 'black', padding: '20px' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80%', backgroundImage: `url(${process.env.PUBLIC_URL}/header.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', opacity: '0.7' }}></div>
                        <p style={{ fontSize: '15px', fontFamily: 'Lucida sans', fontWeight: 'bolder', marginBottom: '6px', marginTop: '30px', zIndex: 1 }}>Welcome, Dr. John Doe!</p>
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
                                <th>Contact No.</th>
                                <th>Preferred Clinic</th>
                                <th>Appointment Date</th>
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
                                    <td>{user.contactnum}</td>
                                    <td>{user.preferred_clinic}</td>
                                    <td>{user.appointment_date}</td>
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
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                key={index}
                                onClick={() => handlePagination(index + 1)}
                                className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} btn-sm mx-1`}
                                >
                                {index + 1}
                                </button>
                            ))}
                            </div>
                </div>
            </div>
        </div>
        <div style={{ flex: '0 0 200px', backgroundColor: '#f0f0f0', padding: '20px', marginTop: '15px', height: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' , borderRadius: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'}}>
            {/* Right Column */}
            {/* Doctor's Profile Content */}
            <img src={process.env.PUBLIC_URL + '/doc.jpg'} alt="Doctor's Profile" style={{ width: '200px', height: '200px', marginBottom: '10px', borderRadius: '10px', marginTop:'20px'}} />
            <h3 class="text-primary">Dr. John Doe</h3>
            <p class="text-secondary" style={{marginBottom:'30px'}}> Internal Medicine and Neurology</p>

                        <div class=" w-100 mb-2">
                            <div class="card border-left-primary shadow h-100 ">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1"> Total Patients</div>
                                        <div class="h6 mb-0 font-weight-bold text-gray-800">{totalRows} Patients</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class=" w-100 mb-2">
                            <div class="card border-left-primary shadow h-100 ">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1"> Appointments</div>
                                        <div class="h6 mb-0 font-weight-bold text-gray-800">{totalRows} Appointments</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{  height: '400px',backgroundColor: '#f0f0f0', padding: '20px', marginTop: '40px', borderRadius: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' }}>
                            <div style={{ width: '230px', height: '230px' }}>
                                <Pie data={pieChartData} />
                            </div>
                        </div>
                              
        </div>
    </div>
            
    );
}

export default Users;