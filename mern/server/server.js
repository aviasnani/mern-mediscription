import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import doctorRoutes from "./routes/doctorRoutes.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/record", records);
app.use("/api/auth", doctorRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});