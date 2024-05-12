import React, { useState } from 'react';
import axios from 'axios';
import {  useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await axios.post('http://localhost:3001/login', { name, password });
        
        const userId = response.data.userId;

        // Fetch user data after successful login
        const userDataResponse = await axios.get(`http://localhost:3001/doctors/${userId}`);

        // Pass user's name to the Profile component when navigating to the profile page
        navigate(`/dashboard/${userDataResponse.data.name}`);
    } catch (error) {
        console.error('Error during login:', error);
    }
};


   
    return (
        <div className="container " >
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-1 shadow-lg my-5 shadow mb-5 rounded">
                        <div className="card-body p-0">
                            <div className="row">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image" style={{ 
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/visit.jpg)`,
                                    backgroundSize: 'cover', // Adjusts the size of the background image to cover the entire container
                                    backgroundPosition: 'center', // Centers the background image horizontally and vertically
                                    backgroundRepeat: 'no-repeat' // Prevents the background image from repeating
                                }}></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                        <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginBottom:'20px'}} />
                                            <h1 className="h4 text-gray-900 mb-4"  style={{fontFamily:'cursive', fontWeight:'bolder'}}>Welcome!</h1>
                                            <p className="text-gray-900 mb-4"  style={{fontSize:'15px'}}>Login to your account</p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="user">
                                            <div className="form-group" style={{borderRadius:'20px', marginBottom:'15px', marginTop:'-15px'}}>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-user" 
                                                placeholder="Name..." 
                                                value={name}  // Make sure to include the value attribute
                                                onChange={(e) => {setName(e.target.value)}} 
                                                id="username" 
                                            />

                                            </div>
                                            <div className="form-group" style={{borderRadius:'20px', marginBottom:'15px'}}>
                                            <input 
                                                type="password" 
                                                className="form-control form-control-user" 
                                                placeholder="Password..." 
                                                value={password}  // Make sure to include the value attribute
                                                onChange={(e) => {setPassword(e.target.value)}} 
                                                id="password" 
                                            />

                                            </div>                                   
                                            <button type="submit" className="btn btn-primary btn-user btn-block" style={{borderRadius:'15px', width:'290px', marginLeft:'35px'}}>Login</button>
                                        </form>
                                        <hr />
                                        
                                        <div className="text-center">
                                            <Link to="/register" className="small">Create an Account!</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
