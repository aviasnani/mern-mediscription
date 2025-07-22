import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken, checkRole } from '../middleware/auth.js';
import db from '../db/connection.js';

const router = express.Router();
const prescriptionsCollection = db.collection('prescriptions');

// Create a new prescription (doctors only)
router.post('/', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    const { patientId, medications } = req.body;
    
    if (!patientId || !medications || !medications.length) {
      return res.status(400).json({ error: 'Patient ID and medications are required' });
    }
    
    const prescription = {
      doctorId: ObjectId.isValid(req.user.id) ?  ObjectId(req.user.id) : null,
      patientId: ObjectId.isValid(patientId) ?  ObjectId(patientId) : null,
      medications,
      createdAt: new Date(),
      status: 'active'
    };
    
    const result = await prescriptionsCollection.insertOne(prescription);
    res.status(201).json({ 
      message: 'Prescription created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all prescriptions for a specific patient
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Only allow patients to view their own prescriptions or doctors
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const prescriptions = await prescriptionsCollection.find({
      patientId: new ObjectId(patientId)
    }).toArray();
    
    // Get doctor details for each prescription
    const doctorsCollection = db.collection('doctors');
    const prescriptionsWithDoctors = await Promise.all(prescriptions.map(async (prescription) => {
      const doctor = await doctorsCollection.findOne({ _id: prescription.doctorId });
      return {
        ...prescription,
        doctorName: doctor ? doctor.name : 'Unknown Doctor'
      };
    }));
    
    res.status(200).json(prescriptionsWithDoctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all prescriptions written by a specific doctor
router.get('/doctor/:doctorId', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    // Doctors can only view their own prescriptions
    if (req.user.id !== doctorId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const prescriptions = await prescriptionsCollection.find({
      doctorId: new ObjectId(doctorId)
    }).toArray();
    
    // Get patient details for each prescription
    const patientsCollection = db.collection('patients');
    const prescriptionsWithPatients = await Promise.all(prescriptions.map(async (prescription) => {
      const patient = await patientsCollection.findOne({ _id: prescription.patientId });
      return {
        ...prescription,
        patientName: patient ? patient.name : 'Unknown Patient'
      };
    }));
    
    res.status(200).json(prescriptionsWithPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;