import { useState } from "react";

export default function DoctorSignup() {
  const [form, setForm] = useState({ name: "", date_of_birth: "",department: "", specialization: "", email: "", password: "",confirm_password: ""  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5050/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "doctor" }),
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
      <h2>Doctor Signup</h2>
      <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="date" placeholder="Date of Birth" onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
      <input type="text" placeholder="Department" onChange={e => setForm({ ...form, department: e.target.value })} />
      <input type ="text"placeholder="specialization" onChange={e => setForm({ ...form, specialization: e.target.value })} />
      <input type ="email"placeholder="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input type="password" placeholder="Confirm password" onChange={e => setForm({ ...form, confirm_password: e.target.value })} />

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