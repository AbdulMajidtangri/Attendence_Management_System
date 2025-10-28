import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Save, X, Loader2 } from 'lucide-react';
import Squares from "./Squares";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    className: "",
    section: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const studentsData = await response.json();
        
        // Flatten the students array since the API returns grouped data
        const allStudents = studentsData.flatMap(group => group.students);
        
        // Find the student by ID
        const student = allStudents.find(s => s._id === id);
        
        if (student) {
          console.log("Found student:", student);
          setFormData({
            rollNumber: student.rollNumber || "",
            name: student.name || "",
            className: student.className || "",
            section: student.section || ""
          });
        } else {
          console.error("Student not found with ID:", id);
          alert("Student not found");
          navigate("/view-students");
        }
      } else {
        console.error("Failed to fetch students");
        alert("Failed to load student data");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Network error while loading student data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");

    try {
      // Only send name, className, and section to backend
      // Roll number should not be updated
      const updateData = {
        name: formData.name,
        className: formData.className,
        section: formData.section
      };

      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        navigate("/view-students");
      } else {
        alert("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Network error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.5}
            borderColor="#374151"
            squareSize={50}
            hoverFillColor="#3B82F6"
          />
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading student data...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-md mx-auto bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Edit Student</h2>
          <p className="text-gray-300 mt-2">Update student information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Roll Number Display - Non-editable */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Roll Number
            </label>
            <div className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-300">
              {formData.rollNumber}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Roll number cannot be changed
            </p>
          </div>

          {/* Name Field - Pre-filled with current student name */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Class/Batch Field - Pre-filled with current class */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Class/Batch
            </label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Section Field - Pre-filled with current section */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Section
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Student
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/view-students")}
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-500 transition-colors font-medium flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}