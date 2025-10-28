import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ClipboardList, 
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  School,
  BookOpen,
  Calendar
} from 'lucide-react';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Attendance', 
      path: '/mark-attendance', 
      icon: ClipboardList,
      description: 'Mark Student Attendance'
    },
    { 
      name: 'Analytics', 
      path: '/reports', 
      icon: BarChart3,
      description: 'Reports & Insights'
    },
  ];

  const studentManagement = [
    { 
      name: 'View Students', 
      path: '/view-students', 
      icon: Users,
      description: 'Browse all students'
    },
    { 
      name: 'Add Student', 
      path: '/add-student', 
      icon: UserPlus,
      description: 'Register new student'
    },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <nav className="bg-gray-900 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <School className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Academix Pro
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-1">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath(item.path)
                          ? 'text-white bg-blue-600 border border-blue-500'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </button>
                  ))}
                  
                  {/* Students Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsStudentsDropdownOpen(!isStudentsDropdownOpen)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname.includes('/students') || location.pathname === '/add-student'
                          ? 'text-white bg-blue-600 border border-blue-500'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Students
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isStudentsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isStudentsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                        {studentManagement.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              navigate(item.path);
                              setIsStudentsDropdownOpen(false);
                            }}
                            className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                              isActivePath(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            <div className="text-left">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-400">{item.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => navigate('/add-student')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </button>
              </div>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-3 border-l border-gray-700 pl-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">Admin</div>
                  <div className="text-gray-400">Administrator</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-white bg-blue-600 border-r-2 border-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
              
              {/* Student Management Section */}
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Student Management
                </div>
                {studentManagement.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActivePath(item.path)
                        ? 'text-white bg-blue-600'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Mobile Quick Actions */}
              <div className="px-3 py-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    navigate('/add-student');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium mb-2"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Student
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for dropdown */}
      {isStudentsDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsStudentsDropdownOpen(false)}
        />
      )}
    </>
  );
}