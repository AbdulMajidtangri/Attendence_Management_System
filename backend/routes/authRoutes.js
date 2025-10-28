const express = require('express');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Create default admin teacher
const createDefaultTeacher = async () => {
  try {
    const existingTeacher = await Teacher.findOne({ username: 'admin' });
    if (!existingTeacher) {
      const defaultTeacher = new Teacher({
        username: 'admin',
        password: 'admin1' // This will be hashed by the pre-save hook
      });
      await defaultTeacher.save();
      console.log(' Default admin teacher created');
    }
  } catch (error) {
    console.error('Error creating default teacher:', error);
  }
};

createDefaultTeacher();

// Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find teacher
    const teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher._id, 
        username: teacher.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Longer expiry for convenience
    );

    res.json({
      token,
      teacher: { 
        id: teacher._id, 
        username: teacher.username 
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token endpoint (optional - for frontend to check token validity)
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id).select('-password');
    
    if (!teacher) {
      return res.status(401).json({ valid: false, message: 'Teacher not found' });
    }

    res.json({ 
      valid: true, 
      teacher: { id: teacher._id, username: teacher.username } 
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token is invalid' });
  }
});

module.exports = router;