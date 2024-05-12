import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


function Register() {
    const navigate = useNavigate()

    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/register',{name, email, password})
        .then(res=>{
            console.log('Registered',res);
            navigate(`/login`)
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="card o-hidden border-2 shadow-lg" style={{margin:'80px', width: '80%',marginLeft:'150px'}} >
            <div className="card-body p-0">
                <div className="row">
                    <div className="col-lg-5  " style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/visit.jpg)` }}></div>
                    <div className="col-lg-7">
                        <div className="p-5">
                            <div className="text-center">
                              <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Your Logo" style={{ width: '150px', marginBottom:'20px'}} />
                                <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                            </div>
                            <form className="user" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input type="text" 
                                        className="form-control form-control-user" 
                                        style={{ borderRadius: '5px', marginBottom: '5px' }} 
                                        name="Name" 
                                        placeholder="Name" 
                                        onChange={(e) => { setName(e.target.value) }} />
                                </div>                               <div className="form-group ">
                                    <input type="email" 
                                        className="form-control form-control-user" 
                                        style={{ borderRadius: '5px', marginBottom: '5px' }} 
                                        name="email" 
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        placeholder="Email Address" />
                                </div>
                                <div className="form-group">
                                    <input type="password" 
                                        className="form-control form-control-user" 
                                        style={{ borderRadius: '5px', marginBottom: '5px' }} 
                                        name="password" 
                                        onChange={(e) => { setPassword(e.target.value) }} 
                                        placeholder="Password" />
                                    
                                </div>
                                
                                 <button type="submit"  className="btn btn-primary btn-user btn-block" style={{ borderRadius: '15px', width: '450px', marginLeft: '30px' }}>Register Account</button>
                            </form>
                            <hr />
                            <div className="text-center">
                                <Link to={`/login`} className="small">Already have an account?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
