import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "staff") {
      navigate("/staff/login");
      return;
    }
    
    fetchPrescriptions();
  }, [navigate]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5050/api/staff/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriptionStatus = async (prescriptionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/staff/prescriptions/${prescriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update prescription status");
      }
      
      // Refresh prescriptions list
      fetchPrescriptions();
      alert("Prescription status updated successfully");
    } catch (error) {
      console.error("Error updating prescription:", error);
      alert("Failed to update prescription status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/staff/login");
  };

  if (loading) return <div>Loading prescriptions...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Staff Dashboard - Prescription Management</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>Total Prescriptions</h3>
          <p>{prescriptions.length}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Pending</h3>
          <p>{prescriptions.filter(p => p.status === 'active').length}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Delivered</h3>
          <p>{prescriptions.filter(p => p.status === 'delivered').length}</p>
        </div>
      </div>

      <div style={styles.prescriptionsList}>
        <h2>All Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          prescriptions.map(prescription => (
            <div key={prescription._id} style={styles.prescriptionCard}>
              <div style={styles.prescriptionHeader}>
                <div>
                  <h3>Prescription #{prescription._id.slice(-6)}</h3>
                  <p><strong>Patient:</strong> {prescription.patientName}</p>
                  <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                  <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={styles.statusSection}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: prescription.status === 'delivered' ? '#4CAF50' : '#ff9800'
                  }}>
                    {prescription.status === 'delivered' ? 'Delivered' : 'Pending'}
                  </span>
                  <select 
                    value={prescription.status}
                    onChange={(e) => updatePrescriptionStatus(prescription._id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="active">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.medicationsSection}>
                <h4>Medications:</h4>
                {prescription.medications.map((med, index) => (
                  <div key={index} style={styles.medicationItem}>
                    <p><strong>{med.name}</strong> - {med.dosage}</p>
                    <p>Frequency: {med.frequency} | Duration: {med.duration}</p>
                    {med.notes && <p>Notes: {med.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    flex: 1,
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  prescriptionsList: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  prescriptionCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  prescriptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '15px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusSelect: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  medicationsSection: {
    borderTop: '1px solid #ddd',
    paddingTop: '15px',
  },
  medicationItem: {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    borderLeft: '3px solid #007bff',
  }
};