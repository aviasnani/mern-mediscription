import React, { useState } from 'react';
import Signup from './components//signup/Signup';
import Login from './components/login/Login';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={styles.container}>
      <h1>{showLogin ? 'Login' : 'Signup'}</h1>
      {showLogin ? <Login /> : <Signup />}
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