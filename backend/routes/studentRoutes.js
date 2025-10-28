const express = require("express");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Helper function to generate sequential roll number
const generateSequentialRollNumber = async (className, section) => {
  // Find the last student in this class and section
  const lastStudent = await Student.findOne(
    { className, section },
    {},
    { sort: { rollNumber: -1 } }
  );

  let sequenceNumber = 1;
  
  if (lastStudent && lastStudent.rollNumber) {
    // Extract the sequence number from existing roll number
    // Format: YYSWSECTION[SEQUENCE] e.g., 23SWA001
    const rollNumber = lastStudent.rollNumber;
    const sequencePart = rollNumber.slice(5); // Get part after "23SWA"
    const lastSequence = parseInt(sequencePart);
    
    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }

  // Format: YY + SW + SECTION + 3-digit sequence
  const yearCode = className.slice(-2); // Last 2 digits of year
  const paddedSequence = String(sequenceNumber).padStart(3, '0');
  
  return `${yearCode}SW${section}${paddedSequence}`;
};

// Get all students (organized by class and section)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .sort({ 
        className: 1, 
        section: 1, 
        rollNumber: 1 
      });
    
    // Group students by class and section for organized response
    const organizedStudents = students.reduce((acc, student) => {
      const key = `${student.className}-${student.section}`;
      if (!acc[key]) {
        acc[key] = {
          className: student.className,
          section: student.section,
          students: []
        };
      }
      acc[key].students.push(student);
      return acc;
    }, {});

    // Convert to array and sort by class then section
    const result = Object.values(organizedStudents).sort((a, b) => {
      if (a.className !== b.className) {
        return a.className.localeCompare(b.className);
      }
      return a.section.localeCompare(b.section);
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique batches
router.get('/batches', async (req, res) => {
  try {
    const batches = await Student.distinct('className');
    res.json(batches.sort());
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sections by batch
router.get('/sections/:batch', async (req, res) => {
  try {
    const { batch } = req.params;
    const sections = await Student.distinct('section', { className: batch });
    res.json(sections.sort());
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students by batch and section
router.get('/:batch/:section', async (req, res) => {
  try {
    const { batch, section } = req.params;
    const students = await Student.find({ className: batch, section })
      .sort({ rollNumber: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new student with sequential roll number
router.post('/', async (req, res) => {
  try {
    const { name, className, section } = req.body;

    // Validate required fields
    if (!name || !className || !section) {
      return res.status(400).json({ 
        message: 'All fields are required: name, className, section' 
      });
    }

    // Generate sequential roll number
    const rollNumber = await generateSequentialRollNumber(className, section);

    // Check if student with same roll number already exists (just in case)
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student with this roll number already exists' 
      });
    }

    // Create new student
    const student = new Student({
      rollNumber,
      name: name.trim(),
      className: className.trim(),
      section: section.trim()
    });

    // ✅ THIS IS WHERE STUDENT GETS SAVED TO DATABASE
    await student.save();

    console.log("✅ Student saved to database:", {
      _id: student._id,
      rollNumber: student.rollNumber,
      name: student.name,
      className: student.className,
      section: student.section
    });

    res.status(201).json({ 
      message: 'Student added successfully', 
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        className: student.className,
        section: student.section
      }
    });
  } catch (error) {
    console.error('❌ Error adding student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate roll number found' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while adding student',
      error: error.message 
    });
  }
});

// Update student
// Update student - Prevent roll number updates
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, className, section } = req.body;

    // Only allow updating name, className, and section
    // Roll number is automatically generated and should not be changed
    const student = await Student.findByIdAndUpdate(
      id,
      { name, className, section },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DEBUG ROUTE - Add this to check if students are in database
router.get('/debug/all', async (req, res) => {
  try {
    const allStudents = await Student.find();
    console.log("📊 All students in database:", allStudents);
    res.json({
      total: allStudents.length,
      students: allStudents
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Debug error' });
  }
});

module.exports = router;