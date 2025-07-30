import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  if (loading) return <div style={styles.loading}>Loading prescriptions...</div>;

  const totalPrescriptions = prescriptions.length;
  const pendingCount = prescriptions.filter(p => p.status === 'active').length;
  const deliveredCount = prescriptions.filter(p => p.status === 'delivered').length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Welcome, {user.name}</h1>
          <p style={styles.subtitle}>Manage prescription deliveries and status updates</p>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <div style={styles.totalIcon}></div>
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{totalPrescriptions}</h3>
                <p style={styles.statLabel}>Total Prescriptions</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <div style={styles.pendingIcon}></div>
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{pendingCount}</h3>
                <p style={styles.statLabel}>Pending Delivery</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <div style={styles.deliveredIcon}></div>
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{deliveredCount}</h3>
                <p style={styles.statLabel}>Delivered</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.prescriptionsSection}>
          <h2 style={styles.sectionTitle}>Prescription Management</h2>
          
          {prescriptions.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No prescriptions found.</p>
            </div>
          ) : (
            <div style={styles.prescriptionsGrid}>
              {prescriptions.map(prescription => (
                <div key={prescription._id} style={styles.prescriptionCard}>
                  <div style={styles.prescriptionHeader}>
                    <div style={styles.prescriptionInfo}>
                      <h3 style={styles.prescriptionId}>#{prescription._id.slice(-6)}</h3>
                      <p style={styles.prescriptionDetail}>
                        <strong>Patient:</strong> {prescription.patientName}
                      </p>
                      <p style={styles.prescriptionDetail}>
                        <strong>Doctor:</strong> {prescription.doctorName}
                      </p>
                      <p style={styles.prescriptionDetail}>
                        <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div style={styles.statusSection}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: prescription.status === 'delivered' ? '#28a745' : '#ffc107',
                        color: prescription.status === 'delivered' ? 'white' : '#212529'
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
                    <h4 style={styles.medicationsTitle}>Medications:</h4>
                    <div style={styles.medicationsList}>
                      {prescription.medications.map((med, index) => (
                        <div key={index} style={styles.medicationItem}>
                          <p style={styles.medicationName}><strong>{med.name}</strong> - {med.dosage}</p>
                          <p style={styles.medicationDetails}>
                            Frequency: {med.frequency} | Duration: {med.duration}
                          </p>
                          {med.notes && (
                            <p style={styles.medicationNotes}>Notes: {med.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#6c757d',
  },
  header: {
    background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
    color: 'white',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: '300',
    margin: 0,
    opacity: 0.9,
  },
  logoutButton: {
    padding: '12px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  statsSection: {
    marginBottom: '60px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid #e9ecef',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  totalIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#007bff',
    borderRadius: '4px',
  },
  pendingIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#ffc107',
    borderRadius: '4px',
  },
  deliveredIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#28a745',
    borderRadius: '4px',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0 0 5px 0',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0,
    fontWeight: '500',
  },
  prescriptionsSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#6c757d',
    margin: 0,
  },
  prescriptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
  },
  prescriptionCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e9ecef',
  },
  prescriptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  prescriptionInfo: {
    flex: 1,
    minWidth: '200px',
  },
  prescriptionId: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 10px 0',
  },
  prescriptionDetail: {
    fontSize: '0.95rem',
    color: '#6c757d',
    margin: '0 0 5px 0',
    lineHeight: '1.4',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    minWidth: '120px',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statusSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '2px solid #e9ecef',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  medicationsSection: {
    borderTop: '1px solid #e9ecef',
    paddingTop: '20px',
  },
  medicationsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  medicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  medicationItem: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #007bff',
  },
  medicationName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 5px 0',
  },
  medicationDetails: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: '0 0 5px 0',
  },
  medicationNotes: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0,
    fontStyle: 'italic',
  },
};