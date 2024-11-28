import React, { useState, useEffect } from 'react';
import './App.css'; // Add custom styles here

const API_URL = 'https://jkouijtzj8.execute-api.us-east-1.amazonaws.com/production/patients'; // Your API Gateway URL

function App() {
  const [patients, setPatients] = useState([]);
  const [patientData, setPatientData] = useState({
    id: '',
    name: '',
    age: '',
    condition: ''
  });
  const [patientIdToRetrieve, setPatientIdToRetrieve] = useState('');
  const [retrievedPatient, setRetrievedPatient] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value
    });
  };

  const handleIdChange = (e) => {
    setPatientIdToRetrieve(e.target.value);
  };

  // Add patient data to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (patients.some((p) => p.id === patientData.id)) {
      setMessage('Error: Patient ID must be unique.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Failed to add patient');
      }

      setPatients([...patients, patientData]);
      setMessage('Patient added successfully!');
      setPatientData({ id: '', name: '', age: '', condition: '' });
    } catch (error) {
      setMessage('Error adding patient: ' + error.message);
    }
  };

  // Retrieve patient data by ID
  const handleRetrieve = async () => {
    try {
      const response = await fetch(`${API_URL}?id=${patientIdToRetrieve}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }

      const patient = await response.json();
      setRetrievedPatient(patient || 'Patient not found');
      setPatientIdToRetrieve('');
    } catch (error) {
      setMessage('Error retrieving patient: ' + error.message);
    }
  };

  // Fetch all patients when the component mounts
  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setMessage('Error fetching patients: ' + error.message);
      }
    };

    fetchAllPatients();
  }, []);

  return (
    <div className="App">
      <h1>Patient Data Management</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <h2>Add New Patient</h2>
        {message && <p className="message">{message}</p>}
        <label>
          <input
            type="text"
            name="id"
            value={patientData.id}
            onChange={handleChange}
            placeholder="Patient ID"
            required
          />
        </label>
        <label>
          <input
            type="text"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </label>
        <label>
          <input
            type="number"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </label>
        <label>
          <input
            type="text"
            name="condition"
            value={patientData.condition}
            onChange={handleChange}
            placeholder="Medical Condition"
            required
          />
        </label>
        <button type="submit" className="btn">Add Patient</button>
      </form>

      <div className="retrieve-container">
        <h2>Retrieve Patient Data</h2>
        <input
          type="text"
          value={patientIdToRetrieve}
          onChange={handleIdChange}
          placeholder="Enter Patient ID"
        />
        <button onClick={handleRetrieve} className="btn">Retrieve</button>
      </div>

      {retrievedPatient && (
        <div className="patient-details">
          <h3>Patient Details</h3>
          {typeof retrievedPatient === 'string' ? (
            <p>{retrievedPatient}</p>
          ) : (
            <ul>
              <li><strong>ID:</strong> {retrievedPatient.id}</li>
              <li><strong>Name:</strong> {retrievedPatient.name}</li>
              <li><strong>Age:</strong> {retrievedPatient.age}</li>
              <li><strong>Condition:</strong> {retrievedPatient.condition}</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
