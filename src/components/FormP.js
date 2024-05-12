import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FormP({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    patientname: '',
    preferred_clinic: '',
    appointment_date: '',
    appointment_time: '',
    status: '',
    note: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { patientname, preferred_clinic, appointment_date, appointment_time, status, note } = formData;

    if (!patientname || !preferred_clinic || !appointment_date || !appointment_time || !status || !note) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setErrorMessage("");

    axios
      .post("http://localhost:3001/create", formData)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Patient</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="patientname">Patient Name</label>
                <input
                  type="text"
                  id="patientname"
                  name="patientname"
                  value={formData.patientname}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="preferred_clinic">Preferred Clinic</label>
                <input
                  type="text"
                  id="preferred_clinic"
                  name="preferred_clinic"
                  value={formData.preferred_clinic}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="appointment_date">Appointment Date</label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              {/* Add other form fields similarly */}
              {errorMessage && <div className="text-danger mb-2">{errorMessage}</div>}
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success" style={{ width: "100px", height: "30px", fontSize: "12px" }}>
                  Submit
                </button>
                <button type="button" className="btn btn-secondary" style={{ width: "100px", height: "30px", fontSize: "12px" }} onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormP;
