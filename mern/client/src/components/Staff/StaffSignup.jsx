import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffSignup() {
  const [form, setForm] = useState({ 
    name: "", 
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
      const res = await fetch("http://localhost:5050/api/staff/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "staff" }),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Server returned invalid response format");
      }

      if (!res.ok) throw new Error(data.error || "Signup failed");

      alert("Signup successful. Please log in.");
      navigate("/staff/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Staff Signup</h2>
      <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}