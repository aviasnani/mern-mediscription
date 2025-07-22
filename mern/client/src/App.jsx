import React, { useState } from 'react';
import DoctorSignup from './components/Doctor/DoctorSignup';
import DoctorLogin from './components/Doctor/DoctorLogin';

function App() {
  const [showLogin, setShowLogin] = useState(true);
 
  return (
    <div style={styles.container}>
      <h1>{showLogin ? 'Doctor Login' : 'Doctor Signup'}</h1>
      {showLogin ? <DoctorLogin /> : <DoctorSignup />}
      <button onClick={() => setShowLogin(!showLogin)} style={styles.toggleButton}>
        {showLogin ? 'Create an account' : 'Already have an account? Log in'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    margin: 'auto',
    width: '300px',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  toggleButton: {
    marginTop: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default App;