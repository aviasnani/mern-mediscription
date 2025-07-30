import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check (should work immediately)
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', port: PORT });
});

// Test route to check if server is responding
app.get('/test', (req, res) => {
  res.json({ message: 'Test successful', timestamp: new Date() });
});

// Import and use routes after middleware setup
try {
  const { default: doctorRoutes } = await import('./routes/doctorRoutes.js');
  const { default: patientRoutes } = await import('./routes/patientRoutes.js');
  const { default: prescriptionRoutes } = await import('./routes/prescriptionRoutes.js');
  const { default: staffRoutes } = await import('./routes/staffRoutes.js');
  const { verifyToken, checkRole } = await import('./middleware/auth.js');

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

  console.log('All routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});