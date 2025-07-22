// server/routes/doctorRoutes.js
import express from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';

const router = express.Router();
const doctorsCollection = db.collection('doctors');

// Doctor signup
router.post('/signup', async (req, res) => {
  try {
    const { name, date_of_birth, department, specialization, email, password, role } = req.body;
    
    // Check if doctor already exists
    const existingDoctor = await doctorsCollection.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new doctor
    const doctor = {
      name,
      date_of_birth,
      department,
      specialization,
      email,
      password: hashedPassword,
      role: role || 'doctor',
      createdAt: new Date()
    };
    
    const result = await doctorsCollection.insertOne(doctor);
    res.status(201).json({ message: 'Doctor registered successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find doctor
    const doctor = await doctorsCollection.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: doctor._id, role: doctor.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ 
      token, 
      doctor: { 
        id: doctor._id, 
        name: doctor.name, 
        email: doctor.email, 
        role: doctor.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
