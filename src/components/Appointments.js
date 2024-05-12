import {Link, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import axios from "axios";
import '../index.css';
/* import Appointments from './Appointments';
import Patients from './Patients';*/
import { useNavigate } from "react-router-dom";


function Appointments() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [activeNavItem, setActiveNavItem] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const handleNavItemClick = (navItem) => {
        setActiveNavItem(navItem);
      };

    useEffect(() => {
        fetchData();
    }, []);

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
                setAppointments(res.data);
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
    const itemsPerPage = 7;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const handlePagination = (page) => {
      setCurrentPage(page);
    };

    const [sortByDate, setSortByDate] = useState('desc');
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
          
         <div className="flex-column" style={{ marginRight:'10px', width: '160px', backgroundColor: '#2F539B', paddingRight: '10px', paddingLeft: '15px' , height: '100vh'}} >
                {/* Navigation Menu */}
                
                <h4 style={{ marginTop:'55px',fontSize:'20px', color:'white', marginLeft:'-5px'}}>
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

        <div style={{ flex: 2, padding: '5px', height: 'auto', marginLeft:'20px' }}>
        <div className=" justify-content-center align-items-cente" style={{ width: '1155px', height: 'auto', marginTop:'10px'}} > 
            <div className=" bg-white box1 " style={{ width:'1150px', flex: '0 0 800px', backgroundColor: '#f0f0f0', height: 'auto', flexDirection: 'column', alignItems: 'center' , borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border:'0.5px outset rgba(126, 124, 124, 0.2)'}}>
                <div style={{marginBottom:'10px', marginTop:'-12px', alignItems:'center'}}>
                    {/* Logo */}
                        <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginLeft:'-5px'}} />
                    {/* Notification Bell 
                        <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px', marginTop:'8px', marginLeft:'80%', marginRight:'5px' }} />
                        <Link to="/profile" style={{textDecoration:'none'}} >
                    <img src={process.env.PUBLIC_URL + '/personB.png'} alt="Your Logo" style={{ width: '30px', marginTop:'8px'}} /> </Link>
                    */}
                </div>
                    
                    {/*<h2 className="centered-label" style={{ marginTop:'10px'}}>APPOINTMENTS</h2> */}
                    <form onSubmit={handleSearch} >
                            <div className=" d-flex justify-content-end" >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="form-control"
                                    style={{ width: '90%',  height: '30px', backgroundColor: '#ced6da', fontSize:'12px', marginTop:'15px' }}
                                />
                                <button className="btn btn-success btn-sm me-4 " style={{ width: '15%', height: '30px', marginTop:'15px', fontSize: '12px' }}>Search</button>
                                <div>
                                    <Link to="/create" className="btn btn-primary btn-sm me-4 " style={{ width: '120%' , marginTop:'15px', height: '30px', fontSize: '12px', marginLeft:'-18px' }}>Add Patient</Link>
                                </div>
                            </div>
                        </form>
                        <br></br> 
                        <table className="table" style={{ width: '100%' }}>
                            <thead>
                            <tr className="justify-content-center">
                                <th style={{ width: '15%', padding:'2px' }}>Patient Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Preferred Clinic</th>
                                <th onClick={handleSortByDate}>Appointment Date  <i className={`fas fa-sort${sortByDate === 'asc' ? '-up' : '-down'}`}></i></th>
                                <th>Appointment Time</th>
                                <th style={{ width: '15%' }}>Reason for Consultation</th>
                                <th>Status</th>
                                <th style={{ width: '10%' }}>Note</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody className="justify-content-center">
                            {currentData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.patientname}</td>
                                    <td>{user.age}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.email}</td>
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
    </div>
            
    );
}

export default Appointments;