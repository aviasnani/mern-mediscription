// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import { verifyToken, checkRole } from './middleware/auth.js';

dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/staff', staffRoutes);

// Protected dashboard routes
app.get('/api/doctor/dashboard', verifyToken, checkRole(['doctor']), (req, res) => {
  res.json({ message: 'Doctor dashboard data', userId: req.user.id });
});

app.get('/api/patient/dashboard', verifyToken, checkRole(['patient']), (req, res) => {
  res.json({ message: 'Patient dashboard data', userId: req.user.id });
});

app.get('/api/staff/dashboard', verifyToken, checkRole(['staff']), (req, res) => {
  res.json({ message: 'Staff dashboard data', userId: req.user.id });
});

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});