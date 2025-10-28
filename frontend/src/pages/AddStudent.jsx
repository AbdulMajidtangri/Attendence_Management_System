import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react';
import Squares from "./Squares";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    className: "",
    section: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nextRollNumber, setNextRollNumber] = useState("");
  const navigate = useNavigate();

  const classOptions = ["2021", "2022", "2023", "2024", "2025"];
  const sectionOptions = ["A", "B", "C", "D"];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchNextRollNumber = async () => {
      if (formData.className && formData.section) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setErrorMessage("Please login again");
            return;
          }

          const response = await fetch(
            `http://localhost:5000/api/students/${formData.className}/${formData.section}`,
            {
              headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.status === 401) {
            handleTokenExpired();
            return;
          }
          
          if (response.ok) {
            const students = await response.json();
            const yearCode = formData.className.slice(-2);
            let nextSequence = 1;
            
            if (students.length > 0) {
              const lastStudent = students[students.length - 1];
              const lastRollNumber = lastStudent.rollNumber;
              const sequencePart = lastRollNumber.slice(5);
              const lastSequence = parseInt(sequencePart);
              
              if (!isNaN(lastSequence)) {
                nextSequence = lastSequence + 1;
              }
            }
            
            const paddedSequence = String(nextSequence).padStart(3, '0');
            const newRollNumber = `${yearCode}SW${formData.section}${paddedSequence}`;
            
            setNextRollNumber(newRollNumber);
            setFormData(prev => ({
              ...prev,
              rollNumber: newRollNumber
            }));
          }
        } catch (error) {
          console.error("Error fetching next roll number:", error);
        }
      }
    };

    fetchNextRollNumber();
  }, [formData.className, formData.section]);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You are not logged in. Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
      return;
    }
  };

  const handleTokenExpired = () => {
    localStorage.removeItem("token");
    setErrorMessage("Session expired. Please login again.");
    setTimeout(() => navigate("/"), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Student name is required");
      return false;
    }
    if (!formData.className) {
      setErrorMessage("Please select a class/batch");
      return false;
    }
    if (!formData.section) {
      setErrorMessage("Please select a section");
      return false;
    }
    
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name.trim())) {
      setErrorMessage("Name should contain only letters and spaces");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    
    if (!token) {
      setErrorMessage("Please login first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          className: formData.className.trim(),
          section: formData.section.trim()
        })
      });

      if (response.status === 401) {
        handleTokenExpired();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Student "${data.student.name}" added successfully with Roll Number: ${data.student.rollNumber}`);
        
        setTimeout(() => {
          setFormData({ 
            rollNumber: "", 
            name: "", 
            className: "", 
            section: "" 
          });
          setNextRollNumber("");
          setSuccessMessage("");
        }, 5000);
        
      } else {
        setErrorMessage(data.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setErrorMessage("Network error. Please check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ 
      rollNumber: "", 
      name: "", 
      className: "", 
      section: "" 
    });
    setNextRollNumber("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Add New Student</h1>
            <p className="text-gray-300 mt-2">Register a new student to the system</p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-300">{successMessage}</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300">{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Class/Batch
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                  required
                >
                  <option value="" className="text-gray-400">Select Class</option>
                  {classOptions.map(className => (
                    <option key={className} value={className} className="text-white">
                      Class {className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Section
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                  required
                >
                  <option value="" className="text-gray-400">Select Section</option>
                  {sectionOptions.map(section => (
                    <option key={section} value={section} className="text-white">
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {nextRollNumber && (
              <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-xl">
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Assigned Roll Number
                </label>
                <div className="text-lg font-bold text-blue-200 font-mono bg-gray-800 px-4 py-2 rounded-lg border border-blue-600">
                  {nextRollNumber}
                </div>
                <p className="text-sm text-blue-300 mt-2">
                  This roll number will be automatically assigned to the student
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                placeholder="Enter student's full name"
                required
                pattern="[A-Za-z\s]+"
                title="Name should contain only letters and spaces"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.className || !formData.section || !formData.name}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding Student...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Student
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-500 transition-colors font-medium flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}