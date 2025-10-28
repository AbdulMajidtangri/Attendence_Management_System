import React, { useState, useEffect } from "react";
import { BarChart3, Calendar, Download, FileText, Filter, Loader2, PieChart, TrendingUp, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Squares from "./Squares";

export default function Reports() {
  const [reportType, setReportType] = useState("daily");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedBatches, setExpandedBatches] = useState(new Set());

  const generateReport = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      let url = "";
      if (reportType === "daily") {
        url = `http://localhost:5000/api/attendance/report/date/${date}`;
      } else {
        url = `http://localhost:5000/api/attendance/report/month/${month}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        const batches = [...new Set(data.map(record => record.studentId.className))];
        setExpandedBatches(new Set(batches));
      } else {
        alert("Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) return;

    const headers = ["Date", "Roll Number", "Name", "Class", "Section", "Status"];
    const csvData = reportData.map(record => [
      record.date,
      record.studentId.rollNumber,
      record.studentId.name,
      record.studentId.className,
      record.studentId.section,
      record.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${reportType}_${reportType === 'daily' ? date : month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group data by batch and section
  const groupedData = reportData ? reportData.reduce((acc, record) => {
    const batch = record.studentId.className;
    const section = record.studentId.section;
    
    if (!acc[batch]) {
      acc[batch] = {};
    }
    if (!acc[batch][section]) {
      acc[batch][section] = [];
    }
    
    acc[batch][section].push(record);
    return acc;
  }, {}) : {};

  // Get all unique batches
  const batches = reportData ? [...new Set(reportData.map(record => record.studentId.className))].sort() : [];

  // Filter batches if a specific batch is selected
  const filteredBatches = selectedBatch === "all" ? batches : batches.filter(batch => batch === selectedBatch);

  // Calculate statistics
  const getBatchStats = (batchData) => {
    const allRecords = Object.values(batchData).flat();
    const presentCount = allRecords.filter(record => record.status === "Present").length;
    const absentCount = allRecords.filter(record => record.status === "Absent").length;
    const totalCount = presentCount + absentCount;
    const attendancePercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
    
    return { presentCount, absentCount, totalCount, attendancePercentage };
  };

  const getSectionStats = (sectionData) => {
    const presentCount = sectionData.filter(record => record.status === "Present").length;
    const absentCount = sectionData.filter(record => record.status === "Absent").length;
    const totalCount = presentCount + absentCount;
    const attendancePercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
    
    return { presentCount, absentCount, totalCount, attendancePercentage };
  };

  // Overall statistics
  const overallStats = reportData ? getBatchStats(groupedData) : { presentCount: 0, absentCount: 0, totalCount: 0, attendancePercentage: 0 };

  const toggleBatch = (batch) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batch)) {
      newExpanded.delete(batch);
    } else {
      newExpanded.add(batch);
    }
    setExpandedBatches(newExpanded);
  };

  const toggleAllBatches = () => {
    if (expandedBatches.size === filteredBatches.length) {
      setExpandedBatches(new Set());
    } else {
      setExpandedBatches(new Set(filteredBatches));
    }
  };

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Attendance Analytics</h1>
          <p className="text-gray-300">Generate detailed attendance reports categorized by batch</p>
        </div>

        {/* Report Controls */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
              >
                <option value="daily" className="text-white">Daily Report</option>
                <option value="monthly" className="text-white">Monthly Report</option>
              </select>
            </div>

            {reportType === "daily" ? (
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
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Month
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Filter by Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white transition-colors"
              >
                <option value="all" className="text-white">All Batches</option>
                {batches.map(batch => (
                  <option key={batch} value={batch} className="text-white">Class {batch}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {reportData && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 font-medium flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Export CSV
              </button>
              
              <button
                onClick={toggleAllBatches}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-all duration-200 font-medium flex items-center"
              >
                {expandedBatches.size === filteredBatches.length ? (
                  <>
                    <ChevronUp className="w-5 h-5 mr-2" />
                    Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Expand All
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {reportData && (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Records</p>
                    <p className="text-2xl font-bold">{overallStats.totalCount}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Present</p>
                    <p className="text-2xl font-bold">{overallStats.presentCount}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-300" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden border border-red-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm">Absent</p>
                    <p className="text-2xl font-bold">{overallStats.absentCount}</p>
                  </div>
                  <PieChart className="w-8 h-8 text-red-300" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Attendance %</p>
                    <p className="text-2xl font-bold">{overallStats.attendancePercentage}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Batch-wise Reports */}
            <div className="space-y-6">
              {filteredBatches.map(batch => {
                const batchData = groupedData[batch];
                const batchStats = getBatchStats(batchData);
                const isExpanded = expandedBatches.has(batch);
                const sections = Object.keys(batchData).sort();

                return (
                  <div key={batch} className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                    {/* Batch Header */}
                    <div 
                      className="px-6 py-4 bg-gray-700/50 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => toggleBatch(batch)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Class {batch}</h3>
                            <p className="text-gray-300">
                              {sections.length} section{sections.length !== 1 ? 's' : ''} • {batchStats.totalCount} records
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-green-400 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {batchStats.presentCount} Present
                              </span>
                              <span className="text-red-400 flex items-center">
                                <PieChart className="w-4 h-4 mr-1" />
                                {batchStats.absentCount} Absent
                              </span>
                              <span className="text-blue-400 font-semibold">
                                {batchStats.attendancePercentage}% Attendance
                              </span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Sections */}
                    {isExpanded && (
                      <div className="divide-y divide-gray-700">
                        {sections.map(section => {
                          const sectionData = batchData[section];
                          const sectionStats = getSectionStats(sectionData);

                          return (
                            <div key={section} className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-md font-semibold text-white">Section {section}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-300">
                                  <span className="text-green-400">{sectionStats.presentCount} Present</span>
                                  <span className="text-red-400">{sectionStats.absentCount} Absent</span>
                                  <span className="text-blue-400 font-semibold">{sectionStats.attendancePercentage}%</span>
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-700">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Roll Number</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-700">
                                    {sectionData.map((record, index) => (
                                      <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                          {record.date}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded text-gray-200">
                                            {record.studentId.rollNumber}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                          {record.studentId.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            record.status === "Present" 
                                              ? "bg-green-900/50 text-green-300 border border-green-700" 
                                              : "bg-red-900/50 text-red-300 border border-red-700"
                                          }`}>
                                            {record.status === "Present" ? (
                                              <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                              <PieChart className="w-3 h-3 mr-1" />
                                            )}
                                            {record.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}