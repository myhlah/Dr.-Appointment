import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react';
//import Users from './components/User'
import CreateUser from './components/CreateUser'
import UpdateUser from './components/UpdateUser'
import Dashboard from './components/Dashboard'
import Appointments from './components/Appointments'
import Patients from './components/Patients'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'
import Dashpatient from './components/Dashpatient'
import Book from './components/Book'

function App() {

    return( 
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/dashboard/:name' element={<Dashboard />}></Route>
                <Route path='/appointments' element={<Appointments />}></Route>
                <Route path='/patients' element={<Patients />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
                <Route path='/dashpatient' element={<Dashpatient />}></Route>
                <Route path='/create' element={<CreateUser />}></Route>
                <Route path='/book' element={<Book />}></Route>
                <Route path='/edit/:id' element={<UpdateUser />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App  
