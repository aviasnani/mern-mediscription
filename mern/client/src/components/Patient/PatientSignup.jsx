import { useState } from "react";

export default function PatientSignup() {
  const [form, setForm] = useState({ 
    name: "", 
    date_of_birth: "",
    address: "", 
    phone: "", 
    email: "", 
    password: "",
    confirm_password: "" 
  });

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
    
    if (form.password !== form.confirm_password) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/patients/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "patient" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      alert("Signup successful. Please log in.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Signup</h2>
      <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input type="date" placeholder="Date of Birth" onChange={e => setForm({ ...form, date_of_birth: e.target.value })} required />
      <input type="text" placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} required />
      <input type="tel" placeholder="Phone Number" onChange={e => setForm({ ...form, phone: e.target.value })} required />
      <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
      <input type="password" placeholder="Confirm Password" onChange={e => setForm({ ...form, confirm_password: e.target.value })} required />

      <button style={styles.button} type="submit">Signup</button>
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
  }
}