import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorSignup from './components/Doctor/DoctorSignup';
import DoctorLogin from './components/Doctor/DoctorLogin';
import PatientSignup from './components/Patient/PatientSignup';
import PatientLogin from './components/Patient/PatientLogin';
import StaffSignup from './components/Staff/StaffSignup';
import StaffLogin from './components/Staff/StaffLogin';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
import StaffDashboard from './components/Staff/StaffDashboard';
import WritePrescription from './components/Doctor/WritePrescription';
import DoctorViewPrescriptions from './components/Doctor/viewPrescriptions';
import ViewPrescriptions from './components/Patient/viewPrescriptions';

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
          <Route path="/staff/signup" element={<StaffSignup />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/doctor/write-prescription" element={<WritePrescription />} />
          <Route path="/doctor/prescriptions" element={<DoctorViewPrescriptions />} />
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
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>MediScription</h1>
          <p style={styles.subtitle}>Professional Healthcare Management System</p>
        </div>
      </header>
      
      <main style={styles.main}>
        <section style={styles.heroSection}>
          <h2 style={styles.heroTitle}>Streamline Your Healthcare Operations</h2>
          <p style={styles.heroDescription}>
            Secure, efficient, and user-friendly platform for managing prescriptions and patient care
          </p>
        </section>
        
        <section style={styles.servicesSection}>
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <div style={styles.doctorIcon}></div>
              </div>
              <h3 style={styles.cardTitle}>Healthcare Providers</h3>
              <p style={styles.cardDescription}>
                Manage patient prescriptions, track medical history, and streamline your practice workflow
              </p>
              <div style={styles.buttonGroup}>
                <a href="/doctor/login" style={styles.primaryButton}>Login</a>
                <a href="/doctor/signup" style={styles.secondaryButton}>Register</a>
              </div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <div style={styles.patientIcon}></div>
              </div>
              <h3 style={styles.cardTitle}>Patients</h3>
              <p style={styles.cardDescription}>
                Access your prescriptions, view medical records, and stay connected with your healthcare providers
              </p>
              <div style={styles.buttonGroup}>
                <a href="/patient/login" style={styles.primaryButton}>Login</a>
                <a href="/patient/signup" style={styles.secondaryButton}>Register</a>
              </div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <div style={styles.staffIcon}></div>
              </div>
              <h3 style={styles.cardTitle}>Pharmacy Staff</h3>
              <p style={styles.cardDescription}>
                Manage prescription deliveries, update order status, and coordinate with healthcare providers
              </p>
              <div style={styles.buttonGroup}>
                <a href="/staff/login" style={styles.primaryButton}>Login</a>
                <a href="/staff/signup" style={styles.secondaryButton}>Register</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer style={styles.footer}>
        <p style={styles.footerText}>MediScription - Secure Healthcare Management Platform</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  home: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '700',
    margin: '0 0 20px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
    fontWeight: '300',
    margin: 0,
    opacity: 0.9,
  },
  main: {
    flex: 1,
    padding: '0 20px',
  },
  heroSection: {
    textAlign: 'center',
    padding: '80px 0 60px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  heroDescription: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#6c757d',
    lineHeight: '1.6',
    margin: 0,
  },
  servicesSection: {
    padding: '40px 0 80px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px 30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #e9ecef',
  },
  cardIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
  },
  patientIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#28a745',
    borderRadius: '50%',
  },
  staffIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#ffc107',
    borderRadius: '50%',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#6c757d',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    minWidth: '100px',
    textAlign: 'center',
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#007bff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    border: '2px solid #007bff',
    transition: 'all 0.3s ease',
    minWidth: '100px',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: '30px 20px',
    marginTop: 'auto',
  },
  footerText: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.8,
  },
};
export default App;