import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import ViewStudents from "./pages/ViewStudents";
import EditStudent from "./pages/EditStudent";
import MarkAttendance from "./pages/MarkAttendance";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Academix Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Global Navbar - Only shows when logged in */}
        {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />}
        
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/add-student" 
            element={
              isLoggedIn ? <AddStudent /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/view-students" 
            element={
              isLoggedIn ? <ViewStudents /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/edit-student/:id" 
            element={
              isLoggedIn ? <EditStudent /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/mark-attendance" 
            element={
              isLoggedIn ? <MarkAttendance /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/reports" 
            element={
              isLoggedIn ? <Reports /> : <Navigate to="/" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;