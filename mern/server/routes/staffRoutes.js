import express from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();
const staffCollection = db.collection('staff');
const prescriptionsCollection = db.collection('prescriptions');

// Staff signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if staff already exists
    const existingStaff = await staffCollection.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new staff
    const staff = {
      name,
      email,
      password: hashedPassword,
      role: 'staff',
      createdAt: new Date()
    };
    
    const result = await staffCollection.insertOne(staff);
    res.status(201).json({ message: 'Staff registered successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Staff login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find staff
    const staff = await staffCollection.findOne({ email });
    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ 
      token, 
      staff: { 
        id: staff._id, 
        name: staff.name, 
        email: staff.email, 
        role: staff.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all prescriptions (staff only)
router.get('/prescriptions', verifyToken, checkRole(['staff']), async (req, res) => {
  try {
    const prescriptions = await prescriptionsCollection.find({}).toArray();
    
    // Get doctor and patient details for each prescription
    const doctorsCollection = db.collection('doctors');
    const patientsCollection = db.collection('patients');
    
    const prescriptionsWithDetails = await Promise.all(prescriptions.map(async (prescription) => {
      const doctor = await doctorsCollection.findOne({ _id: prescription.doctorId });
      const patient = await patientsCollection.findOne({ _id: prescription.patientId });
      
      return {
        ...prescription,
        doctorName: doctor ? doctor.name : 'Unknown Doctor',
        patientName: patient ? patient.name : 'Unknown Patient'
      };
    }));
    
    res.status(200).json(prescriptionsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prescription status (staff only)
router.patch('/prescriptions/:id', verifyToken, checkRole(['staff']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const result = await prescriptionsCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.status(200).json({ message: 'Prescription status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;