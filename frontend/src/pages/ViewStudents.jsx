import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  BarChart3, 
  Search, 
  Filter,
  Download,
  Menu,
  X,
  Plus,
  CheckCircle,
  PieChart,
  School,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import Squares from "./Squares";

export default function ViewStudents() {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [selectedClass, selectedSection, searchTerm, studentsData]);

  const fetchStudents = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = studentsData.flatMap(group => group.students);

    if (selectedClass !== "all") {
      filtered = filtered.filter(student => student.className === selectedClass);
    }

    if (selectedSection !== "all") {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Delete student "${studentName}"? This action cannot be undone.`)) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const totalStudents = studentsData.reduce((sum, group) => sum + group.students.length, 0);
  const uniqueClasses = [...new Set(studentsData.map(group => group.className))];
  const uniqueSections = [...new Set(studentsData.map(group => group.section))];

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading student database...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Fixed and independently scrollable */}
 {/* Sidebar - Fixed and independently scrollable with hidden scrollbar */}
{sidebarOpen && (
  <div className="w-80 flex-shrink-0">
    <div className="fixed h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      <div className="w-80 pr-4 space-y-6 pb-8">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Student Database</h3>
          
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              >
                <option value="all" className="text-gray-400">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className} className="text-white">Class {className}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              >
                <option value="all" className="text-gray-400">All Sections</option>
                {uniqueSections.map(section => (
                  <option key={section} value={section} className="text-white">Section {section}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <div>
                <p className="text-sm font-medium text-blue-200">Total Students</p>
                <p className="text-2xl font-bold text-white">{totalStudents}</p>
              </div>
              <div className="p-2 bg-blue-800/50 rounded-lg">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-green-700">
              <div>
                <p className="text-sm font-medium text-green-200">Active Classes</p>
                <p className="text-2xl font-bold text-white">{uniqueClasses.length}</p>
              </div>
              <div className="p-2 bg-green-800/50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/add-student")}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-3 text-blue-400" />
              Add New Student
            </button>
            <button
              onClick={() => navigate("/mark-attendance")}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
              Mark Attendance
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <PieChart className="w-4 h-4 mr-3 text-purple-400" />
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Student Records</h2>
                    <p className="text-sm text-gray-300 mt-1">
                      {filteredStudents.length} students found
                      {searchTerm && ` for "${searchTerm}"`}
                      {selectedClass !== "all" && ` in Class ${selectedClass}`}
                      {selectedSection !== "all" && `, Section ${selectedSection}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 text-sm text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => navigate("/add-student")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Add New Student
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Class Information
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{student.name}</div>
                                <div className="text-sm text-gray-400">
                                  Added {new Date(student.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                                Class {student.className}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                                Section {student.section}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono font-semibold text-white bg-gray-700 px-3 py-1 rounded-lg inline-block border border-gray-600">
                              {student.rollNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/edit-student/${student._id}`}
                                className="text-blue-400 hover:text-blue-300 bg-blue-900/30 px-3 py-1 rounded-lg transition-colors border border-blue-700"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(student._id, student.name)}
                                className="text-red-400 hover:text-red-300 bg-red-900/30 px-3 py-1 rounded-lg transition-colors border border-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 text-white border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Records</p>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 text-white border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Active Classes</p>
                    <p className="text-2xl font-bold">{uniqueClasses.length}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <School className="w-8 h-8 text-green-300" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 text-white border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Showing</p>
                    <p className="text-2xl font-bold">{filteredStudents.length}</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <UserCheck className="w-8 h-8 text-purple-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}