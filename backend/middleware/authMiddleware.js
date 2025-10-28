const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if teacher exists
      const teacher = await Teacher.findById(decoded.id).select('-password');
      if (!teacher) {
        return res.status(401).json({ message: 'Token is not valid - teacher not found' });
      }

      req.teacher = teacher;
      next();
    } catch (jwtError) {
      console.error('JWT Error:', jwtError);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = authMiddleware;