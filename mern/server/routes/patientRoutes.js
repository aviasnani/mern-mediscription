import express from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();
const patientsCollection = db.collection('patients');

// Get all patients (doctors only)
router.get('/', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    const patients = await patientsCollection.find({}).toArray();
    
    // Remove sensitive information
    const safePatients = patients.map(patient => ({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
      phone: patient.phone
    }));
    
    res.status(200).json(safePatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Patient signup
router.post('/signup', async (req, res) => {
  try {
    const { name, date_of_birth, address, phone, email, password, role } = req.body;
    
    // Check if patient already exists
    const existingPatient = await patientsCollection.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new patient
    const patient = {
      name,
      date_of_birth,
      address,
      phone,
      email,
      password: hashedPassword,
      role: role || 'patient',
      createdAt: new Date()
    };
    
    const result = await patientsCollection.insertOne(patient);
    res.status(201).json({ message: 'Patient registered successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Patient login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find patient
    const patient = await patientsCollection.findOne({ email });
    if (!patient) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: patient._id, role: patient.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ 
      token, 
      patient: { 
        id: patient._id, 
        name: patient.name, 
        email: patient.email, 
        role: patient.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;