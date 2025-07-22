import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "doctor") {
      navigate("/doctor/login");
      return;
    }
    
    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/doctor/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Check content type before parsing JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Server returned non-JSON response");
          throw new Error("Server returned invalid response");
        }
        
        if (!response.ok) {
          throw new Error("Not authorized");
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Dashboard error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/doctor/login");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/doctor/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.dashboard}>
      <h1>Doctor Dashboard</h1>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3>Appointments Today</h3>
          <p className="number">5</p>
        </div>
        <div style={styles.card}>
          <h3>Patients</h3>
          <p className="number">24</p>
        </div>
        <div style={styles.card}>
          <h3>Prescriptions</h3>
          <p className="number">18</p>
        </div>
      </div>
      
      <div style={styles.actions}>
        <Link to="/doctor/write-prescription" style={styles.actionButton}>
          Write New Prescription
        </Link>
        <Link to="/doctor/prescriptions" style={styles.actionButton}>
          View All Prescriptions
        </Link>
      </div>
      
      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
}

const styles = {
  dashboard: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  actionButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};