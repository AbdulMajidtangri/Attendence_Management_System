const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  className: { type: String, required: true },
  section: { type: String, required: true }
}, { timestamps: true });

// Prevent duplicate attendance for same student on same day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);