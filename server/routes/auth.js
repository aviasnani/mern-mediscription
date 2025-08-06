import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';

const router = express.Router();

// Google Auth for all user types
router.post('/google-auth', async (req, res) => {
  try {
    const { email, name, googleId, role } = req.body;
    
    if (!email || !name || !googleId || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let collection, user;
    
    // Determine collection based on role
    switch (role) {
      case 'doctor':
        collection = db.collection('doctors');
        break;
      case 'patient':
        collection = db.collection('patients');
        break;
      case 'staff':
        collection = db.collection('staff');
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    user = await collection.findOne({ email });
    
    if (!user) {
      // Create new user
      const newUser = {
        name,
        email,
        googleId,
        role,
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;