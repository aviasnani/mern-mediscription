import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WritePrescription() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "", notes: "" }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/doctor/login");
      return;
    }

    // Fetch patients from the database
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/patients", {
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
          throw new Error("Failed to fetch patients");
        }
        
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, [navigate]);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "", notes: "" }
    ]);
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    
    if (!medications[0].name) {
      alert("Please add at least one medication");
      return;
    }
    
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://localhost:5050/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          medications
        })
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Server returned non-JSON response");
        throw new Error("Server returned invalid response");
      }
      
      if (!response.ok) {
        throw new Error("Failed to create prescription");
      }
      
      alert("Prescription created successfully");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert(error.message);
    }
  };

  if (loading) return <div>Loading patients...</div>;

  return (
    <div style={styles.container}>
      <h2>Write Prescription</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="patient">Select Patient:</label>
          <select 
            id="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">-- Select Patient --</option>
            {patients.length > 0 ? (
              patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No patients found</option>
            )}
          </select>
        </div>
        
        <h3>Medications</h3>
        
        {medications.map((medication, index) => (
          <div key={index} style={styles.medicationCard}>
            <div style={styles.formGroup}>
              <label htmlFor={`med-name-${index}`}>Medication Name:</label>
              <input
                id={`med-name-${index}`}
                type="text"
                value={medication.name}
                onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor={`med-dosage-${index}`}>Dosage:</label>
              <input
                id={`med-dosage-${index}`}
                type="text"
                value={medication.dosage}
                onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                required
                style={styles.input}
                placeholder="e.g., 500mg"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor={`med-frequency-${index}`}>Frequency:</label>
              <input
                id={`med-frequency-${index}`}
                type="text"
                value={medication.frequency}
                onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                required
                style={styles.input}
                placeholder="e.g., 3 times a day"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor={`med-duration-${index}`}>Duration:</label>
              <input
                id={`med-duration-${index}`}
                type="text"
                value={medication.duration}
                onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                required
                style={styles.input}
                placeholder="e.g., 7 days"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor={`med-notes-${index}`}>Additional Notes:</label>
              <textarea
                id={`med-notes-${index}`}
                value={medication.notes}
                onChange={(e) => handleMedicationChange(index, "notes", e.target.value)}
                style={styles.textarea}
                placeholder="e.g., Take after meals"
              />
            </div>
            
            {medications.length > 1 && (
              <button 
                type="button" 
                onClick={() => handleRemoveMedication(index)}
                style={styles.removeButton}
              >
                Remove Medication
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={handleAddMedication}
          style={styles.addButton}
        >
          + Add Another Medication
        </button>
        
        <button type="submit" style={styles.submitButton}>
          Create Prescription
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    minHeight: '80px',
  },
  medicationCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    float: 'right',
  }
};