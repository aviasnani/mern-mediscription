import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken, checkRole } from '../middleware/auth.js';
import db from '../db/connection.js';

const router = express.Router();
const prescriptionsCollection = db.collection('prescriptions');

// Create a new prescription (doctors only)
router.post('/', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    console.log('Creating prescription request:', req.body);
    console.log('User info:', req.user);
    
    const { patientId, medications } = req.body;
    
    if (!patientId || !medications || !medications.length) {
      return res.status(400).json({ error: 'Patient ID and medications are required' });
    }
    
    // Create ObjectIds safely using the recommended approach
    let doctorObjectId, patientObjectId;
    
    try {
      doctorObjectId = ObjectId.createFromHexString(req.user.id);
    } catch (e) {
      console.error('Invalid doctor ID:', req.user.id);
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }
    
    try {
      patientObjectId = ObjectId.createFromHexString(patientId);
    } catch (e) {
      console.error('Invalid patient ID:', patientId);
      return res.status(400).json({ error: 'Invalid patient ID' });
    }
    
    const prescription = {
      doctorId: doctorObjectId,
      patientId: patientObjectId,
      medications,
      createdAt: new Date(),
      status: 'active'
    };
    
    console.log('Inserting prescription:', prescription);
    const result = await prescriptionsCollection.insertOne(prescription);
    console.log('Prescription created:', result);
    
    res.status(201).json({ 
      message: 'Prescription created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Prescription creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all prescriptions for a specific patient
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Only allow patients to view their own prescriptions or doctors/staff
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    let patientObjectId;
    try {
      patientObjectId = ObjectId.createFromHexString(patientId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }
    
    const prescriptions = await prescriptionsCollection.find({
      patientId: patientObjectId
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
    console.error('Get prescriptions error:', error);
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
    
    let doctorObjectId;
    try {
      doctorObjectId = ObjectId.createFromHexString(doctorId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }
    
    const prescriptions = await prescriptionsCollection.find({
      doctorId: doctorObjectId
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
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;