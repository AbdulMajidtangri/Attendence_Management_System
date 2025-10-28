const mongoose = require('mongoose');
require('dotenv').config();

const fixDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the students collection
    const db = mongoose.connection.db;
    const studentsCollection = db.collection('students');

    // Drop the problematic studentId index
    try {
      await studentsCollection.dropIndex('studentId_1');
      console.log('✅ Dropped studentId index');
    } catch (error) {
      console.log('ℹ️  studentId index already removed or never existed');
    }

    // Remove any documents with null studentId (if they exist)
    const result = await studentsCollection.deleteMany({ studentId: null });
    console.log(`✅ Removed ${result.deletedCount} problematic documents`);

    console.log('✅ Database fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
};

fixDatabase();