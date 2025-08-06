import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorSignup() {
  const [form, setForm] = useState({ 
    name: "", 
    date_of_birth: "",
    department: "", 
    specialization: "", 
    email: "", 
    password: "",
    confirm_password: ""  
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password strength
    if (!validatePassword(form.password)) {
      alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>)");
      return;
    }

    // Validate passwords match
    if (form.password !== form.confirm_password) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/doctors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "doctor" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      alert("Signup successful. Please log in.");
      navigate("/doctor/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Doctor Signup</h2>
      <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input type="date" placeholder="Date of Birth" onChange={e => setForm({ ...form, date_of_birth: e.target.value })} required />
      <input type="text" placeholder="Department" onChange={e => setForm({ ...form, department: e.target.value })} required />
      <input type="text" placeholder="Specialization" onChange={e => setForm({ ...form, specialization: e.target.value })} required />
      <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
      <input type="password" placeholder="Confirm password" onChange={e => setForm({ ...form, confirm_password: e.target.value })} required />

      <button style={styles.button} type="submit">Signup</button>
    </form>
  );
}

const styles = {
  button: {
    width: '70px',
    height: '40px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}