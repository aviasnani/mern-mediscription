const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getDB } = require("../db/connection");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const db = getDB();
  const existing = await db.collection("users").findOne({ email, role });
  if (existing) return res.status(400).json({ error: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ name, email, password: hashed, role });
  res.json({ message: "Signup successful" });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  const db = getDB();
  const user = await db.collection("users").findOne({ email, role });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, role: user.role });
});

module.exports = router;