import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Import routes after setting up basic middleware
import records from "./routes/record.js";
app.use("/record", records);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});