const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Mark attendance
router.post('/mark', async (req, res) => {
  try {
    const { batch, section, date, attendanceRecords } = req.body;

    if (!batch || !section || !date || !attendanceRecords) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const attendancePromises = Object.entries(attendanceRecords).map(
      async ([studentId, status]) => {
        try {
          const attendance = new Attendance({
            studentId,
            date,
            status,
            className: batch,
            section
          });
          return await attendance.save();
        } catch (error) {
          // Handle duplicate attendance (same student, same date)
          if (error.code === 11000) {
            return await Attendance.findOneAndUpdate(
              { studentId, date },
              { status },
              { new: true }
            );
          }
          throw error;
        }
      }
    );

    await Promise.all(attendancePromises);
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance report by date
router.get('/report/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendance = await Attendance.find({ date })
      .populate('studentId', 'rollNumber name className section')
      .sort({ className: 1, section: 1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance report by month
router.get('/report/month/:month', async (req, res) => {
  try {
    const { month } = req.params; // Format: YYYY-MM
    const attendance = await Attendance.find({
      date: { $regex: `^${month}` }
    })
      .populate('studentId', 'rollNumber name className section')
      .sort({ date: 1, className: 1, section: 1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student attendance percentage
router.get('/report/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const totalDays = await Attendance.countDocuments({ studentId });
    const presentDays = await Attendance.countDocuments({ 
      studentId, 
      status: 'Present' 
    });
    
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    
    res.json({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      percentage: percentage.toFixed(2)
    });
  } catch (error) {
    console.error('Error calculating attendance percentage:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;