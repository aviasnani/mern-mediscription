import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "patient") {
      navigate("/patient/login");
      return;
    }
    
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/prescriptions/patient/${user.id}`, {
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
    
    fetchPrescriptions();
  }, [navigate]);

  if (loading) return <div>Loading prescriptions...</div>;

  return (
    <div style={styles.container}>
      <h2>My Prescriptions</h2>
      
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        prescriptions.map(prescription => (
          <div key={prescription._id} style={styles.prescriptionCard}>
            <div style={styles.prescriptionHeader}>
              <div>
                <h3>Prescription</h3>
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
              </div>
            </div>
            
            <div style={styles.medicationsContainer}>
              {prescription.medications.map((medication, index) => (
                <div key={index} style={styles.medicationItem}>
                  <h4>{medication.name}</h4>
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                  <p><strong>Frequency:</strong> {medication.frequency}</p>
                  <p><strong>Duration:</strong> {medication.duration}</p>
                  {medication.notes && (
                    <p><strong>Notes:</strong> {medication.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  prescriptionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  prescriptionHeader: {
    backgroundColor: '#f5f5f5',
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '5px 15px',
    borderRadius: '15px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  medicationsContainer: {
    padding: '20px',
  },
  medicationItem: {
    borderLeft: '3px solid #2196F3',
    padding: '10px 15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  }
};