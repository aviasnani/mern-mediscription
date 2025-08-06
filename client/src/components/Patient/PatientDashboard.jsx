import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionCount, setPrescriptionCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "patient") {
      navigate("/patient/login");
      return;
    }
    
    fetchDashboard();
    fetchPrescriptionCount();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patient/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
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
      navigate("/patient/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/patient/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptionCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching prescription count:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/patient/login");
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Welcome, {user.name}</h1>
          <p style={styles.subtitle}>Access your prescriptions and medical information</p>
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
                <div style={styles.prescriptionIcon}></div>
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{prescriptionCount}</h3>
                <p style={styles.statLabel}>Total Prescriptions</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <div style={styles.recordIcon}></div>
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statNumber}>{prescriptionCount}</h3>
                <p style={styles.statLabel}>Medical Records</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.actionsSection}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <Link to="/patient/prescriptions" style={styles.actionCard}>
              <div style={styles.actionIcon}>
                <div style={styles.viewIcon}></div>
              </div>
              <div style={styles.actionContent}>
                <h3 style={styles.actionTitle}>View Prescriptions</h3>
                <p style={styles.actionDescription}>Access your current and past prescriptions</p>
              </div>
            </Link>
            
            <div style={styles.actionCard}>
              <div style={styles.actionIcon}>
                <div style={styles.profileIcon}></div>
              </div>
              <div style={styles.actionContent}>
                <h3 style={styles.actionTitle}>Medical Profile</h3>
                <p style={styles.actionDescription}>View and update your medical information</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Important Information</h3>
            <ul style={styles.infoList}>
              <li style={styles.infoItem}>Always follow your doctor's prescription instructions</li>
              <li style={styles.infoItem}>Check prescription status regularly for updates</li>
              <li style={styles.infoItem}>Contact your healthcare provider for any concerns</li>
              <li style={styles.infoItem}>Keep your medical information up to date</li>
            </ul>
          </div>
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
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  statsSection: {
    marginBottom: '60px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
  prescriptionIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#2196F3',
    borderRadius: '4px',
  },
  recordIcon: {
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
  actionsSection: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.3s ease',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
  },
  actionIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  viewIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#2196F3',
    borderRadius: '4px',
  },
  profileIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#ffc107',
    borderRadius: '50%',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 8px 0',
  },
  actionDescription: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0,
    lineHeight: '1.5',
  },
  infoSection: {
    marginBottom: '40px',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e9ecef',
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  infoItem: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '12px',
    paddingLeft: '20px',
    position: 'relative',
    lineHeight: '1.5',
  },
};