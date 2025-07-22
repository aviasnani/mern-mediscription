import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorSignup from './components/Doctor/DoctorSignup';
import DoctorLogin from './components/Doctor/DoctorLogin';
import PatientSignup from './components/Patient/PatientSignup';
import PatientLogin from './components/Patient/PatientLogin';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
import WritePrescription from './components/Doctor/WritePrescription';
import ViewPrescriptions from './components/Patient/ViewPrescriptions';

function App() {
  return (
    <BrowserRouter>
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/write-prescription" element={<WritePrescription />} />
          <Route path="/patient/prescriptions" element={<ViewPrescriptions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div style={styles.home}>
      <h1>MediScription</h1>
      <p>Your Healthcare Management System</p>
      
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h2>For Doctors</h2>
          <p>Manage your patients and prescriptions</p>
          <div style={styles.buttonGroup}>
            <a href="/doctor/login" style={styles.button}>Login</a>
            <a href="/doctor/signup" style={styles.button}>Signup</a>
          </div>
        </div>
        
        <div style={styles.card}>
          <h2>For Patients</h2>
          <p>Access your medical records and prescriptions</p>
          <div style={styles.buttonGroup}>
            <a href="/patient/login" style={styles.button}>Login</a>
            <a href="/patient/signup" style={styles.button}>Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  home: {
    textAlign: 'center',
    marginTop: '50px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '50px',
  },
  card: {
    width: '300px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};

export default App;