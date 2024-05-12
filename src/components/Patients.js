import {Link, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import axios from "axios";
import '../index.css';



function Users() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [activeNavItem, setActiveNavItem] = useState(null);

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
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const handlePagination = (page) => {
      setCurrentPage(page);
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

        <div style={{ flex: 2, padding: '5px', height: '100vh' }}>
            <div className="boxe justify-content-center align-items-cente" style={{ width: '100%', height: 'auto', marginTop:'-10px'}} > 
                <div className=" bg-white box1 " >
                    <div style={{marginBottom:'10px', marginTop:'-15px', alignItems:'center'}}>
                        {/* Logo */}
                            <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginLeft:'70px'}} />
                        {/* User Name */}
                            <span style={{ fontWeight: 'bold', marginLeft:'60%', marginRight:'25px', fontSize:'12px' }}>Dr. John Doe</span>
                        {/* Notification Bell */}
                            <img src={process.env.PUBLIC_URL + '/bell.png'} alt="Your Logo" style={{ width: '30px', height: '30px' }} />
                        
                    </div>
                    <div style={{ borderBottom: '2px solid #2F539B' }}></div>
                    <h2 className="centered-label">LIST OF PATIENTS</h2> 
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
                        <table className="table" style={{ width: '100%' }}>
                            <thead>
                            <tr className="justify-content-center">
                                <th style={{ width: '15%', padding:'2px' }}>Patient Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact No.</th>
                                <th>Email</th>
                                <th>Preferred Clinic</th>
                                <th>Appointment Date</th>
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
                                    <td>{user.contactnum}</td>
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
    </div>
            
    );
}

export default Users;