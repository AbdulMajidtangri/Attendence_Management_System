import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  ClipboardList,
  BarChart3,
  ArrowRight,
  Plus,
  CheckCircle,
  PieChart,
  Clock,
} from "lucide-react";
import Squares from "./Squares"; // Make sure this path is correct

export default function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Student Management",
      description: "Add, view, and manage student records",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      path: "/view-students",
    },
    {
      title: "Add New Student",
      description: "Register new students to the system",
      icon: UserPlus,
      gradient: "from-green-500 to-green-600",
      path: "/add-student",
    },
    {
      title: "Attendance Tracking",
      description: "Record daily student attendance",
      icon: ClipboardList,
      gradient: "from-purple-500 to-purple-600",
      path: "/mark-attendance",
    },
    {
      title: "Analytics & Reports",
      description: "Generate insights and reports",
      icon: BarChart3,
      gradient: "from-orange-500 to-orange-600",
      path: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#374151" // gray-700
          squareSize={50}
          hoverFillColor="#3B82F6" // blue-500
        />
      </div>

      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Academix Pro
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your educational institution with powerful tools and insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={index}
                to={feature.path}
                className="group bg-transparent relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
              >
                {/* Glass morphism effect */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl" />

                {/* Gradient Border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute inset-[1px] bg-gray-900/80 backdrop-blur-sm rounded-2xl" />

                {/* Content */}
                <div className="relative z-10 p-6">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-400 font-semibold text-sm">
                    Explore feature
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden group transform transition-all duration-300 hover:scale-105 border border-blue-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-3xl font-bold mt-2">1,247</p>
                <p className="text-blue-300 text-xs mt-1">
                  ↑ 12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden group transform transition-all duration-300 hover:scale-105 border border-green-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">
                  Active Classes
                </p>
                <p className="text-3xl font-bold mt-2">24</p>
                <p className="text-green-300 text-xs mt-1">5 classes ongoing</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden group transform transition-all duration-300 hover:scale-105 border border-purple-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Today's Attendance
                </p>
                <p className="text-3xl font-bold mt-2">94%</p>
                <p className="text-purple-300 text-xs mt-1">6% absent today</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <PieChart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 text-white relative overflow-hidden group transform transition-all duration-300 hover:scale-105 border border-orange-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold mt-2">8</p>
                <p className="text-orange-300 text-xs mt-1">3 high priority</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Actions
            </span>
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <button
              onClick={() => navigate("/add-student")}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">
                    Add Student
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Register new student
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
            </button>

            <button
              onClick={() => navigate("/mark-attendance")}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-5 border border-green-500/20 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">
                    Mark Attendance
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Record today's presence
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-green-400" />
              </div>
            </button>

            <button
              onClick={() => navigate("/reports")}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">
                    View Reports
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Analytics & insights
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}