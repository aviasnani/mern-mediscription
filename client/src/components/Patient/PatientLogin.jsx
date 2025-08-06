import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

export default function PatientLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/patients/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          googleId: user.uid,
          role: "patient"
        }),
      });

      const responseText = await res.text();
      
      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        throw new Error('Backend server not accessible. Please start the server.');
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid server response');
      }
      
      if (!res.ok) throw new Error(data.error || "Google auth failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/patient/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/patients/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.patient));
      
      // Redirect to dashboard
      navigate("/patient/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} 
        required 
      />
      <button style={styles.button} type="submit">Login</button>
      
      <div style={styles.divider}>OR</div>
      
      <button 
        type="button" 
        onClick={handleGoogleAuth}
        style={styles.googleButton}
      >
        Continue with Google
      </button>
    </form>
  );
}

const styles = {
  button: {
    width: '70px',
    height: '40px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#666',
    fontSize: '14px'
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}