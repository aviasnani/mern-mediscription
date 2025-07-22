import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import express from "express";
import cors from "cors";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import { verifyToken, checkRole } from "./middleware/auth.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

// Prescription routes (protected)
app.use("/api/prescriptions", prescriptionRoutes);

// Protected routes
app.get("/api/doctor/dashboard", verifyToken, checkRole(['doctor']), (req, res) => {
  res.json({ message: "Doctor dashboard data", userId: req.user.id });
});

app.get("/api/patient/dashboard", verifyToken, checkRole(['patient']), (req, res) => {
  res.json({ message: "Patient dashboard data", userId: req.user.id });
});

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});