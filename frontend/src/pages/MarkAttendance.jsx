import React, { useState, useEffect } from "react";
import { Calendar, Users, BookOpen, CheckCircle, XCircle, Loader2, ClipboardCheck } from 'lucide-react';
import Squares from "./Squares";

export default function MarkAttendance() {
  const [studentsData, setStudentsData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (studentsData.length > 0) {
      const uniqueBatches = [...new Set(studentsData.flatMap(group => 
        group.students.map(student => student.className)
      ))];
      
      const uniqueSections = [...new Set(studentsData.flatMap(group => 
        group.students.map(student => student.section)
      ))];
      
      setBatches(uniqueBatches.sort());
      setSections(uniqueSections.sort());
    }
  }, [studentsData]);

  useEffect(() => {
    if (selectedBatch && selectedSection) {
      fetchStudentsForAttendance(selectedBatch, selectedSection);
    } else {
      setStudents([]);
    }
  }, [selectedBatch, selectedSection]);

  const fetchAllStudents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentsData(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchStudentsForAttendance = async (batch, section) => {
    setLoading(true);
    
    const filteredStudents = studentsData.flatMap(group => 
      group.students.filter(student => 
        student.className === batch && student.section === section
      )
    );
    
    setStudents(filteredStudents);
    
    const initialAttendance = {};
    filteredStudents.forEach(student => {
      initialAttendance[student._id] = "Present";
    });
    setAttendance(initialAttendance);
    
    setLoading(false);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          batch: selectedBatch,
          section: selectedSection,
          date: date,
          attendanceRecords: attendance
        })
      });

      if (response.ok) {
        alert("Attendance marked successfully!");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter(status => status === "Present").length;
  const absentCount = Object.values(attendance).filter(status => status === "Absent").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden py-8">
      {/* Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#374151"
          squareSize={50}
          hoverFillColor="#3B82F6"
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mark Attendance</h1>
          <p className="text-gray-300">Record daily student attendance</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Class
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                  required
                >
                  <option value="" className="text-gray-400">Select Class</option>
                  {batches.map(batch => (
                    <option key={batch} value={batch} className="text-white">Class {batch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                  required
                >
                  <option value="" className="text-gray-400">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section} className="text-white">Section {section}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students List */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-gray-300">Loading students...</p>
              </div>
            ) : students.length > 0 && (
              <>
                {/* Summary Stats */}
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Class {selectedBatch} - Section {selectedSection}
                      </h3>
                      <p className="text-gray-300">{students.length} students found</p>
                    </div>
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <div className="flex items-center text-green-400 mb-1">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span className="text-2xl font-bold text-white">{presentCount}</span>
                        </div>
                        <p className="text-sm text-gray-300">Present</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center text-red-400 mb-1">
                          <XCircle className="w-5 h-5 mr-1" />
                          <span className="text-2xl font-bold text-white">{absentCount}</span>
                        </div>
                        <p className="text-sm text-gray-300">Absent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Attendance */}
                <div className="border border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <h4 className="font-semibold text-white">Student Attendance</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {students.map((student, index) => (
                      <div 
                        key={student._id} 
                        className={`flex items-center justify-between p-4 border-b border-gray-600 hover:bg-gray-700/50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{student.name}</div>
                            <div className="text-sm text-gray-300 font-mono">{student.rollNumber}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="Present"
                              checked={attendance[student._id] === "Present"}
                              onChange={() => handleAttendanceChange(student._id, "Present")}
                              className="w-4 h-4 text-green-500 focus:ring-green-500 border-gray-600 bg-gray-700"
                            />
                            <span className="ml-2 flex items-center text-green-400">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Present
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="Absent"
                              checked={attendance[student._id] === "Absent"}
                              onChange={() => handleAttendanceChange(student._id, "Absent")}
                              className="w-4 h-4 text-red-500 focus:ring-red-500 border-gray-600 bg-gray-700"
                            />
                            <span className="ml-2 flex items-center text-red-400">
                              <XCircle className="w-4 h-4 mr-1" />
                              Absent
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Attendance...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-5 h-5 mr-2" />
                      Submit Attendance
                    </>
                  )}
                </button>
              </>
            )}

            {!loading && students.length === 0 && selectedBatch && selectedSection && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
                <p className="text-gray-400">No students registered in Class {selectedBatch}, Section {selectedSection}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}