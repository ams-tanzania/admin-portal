import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import toast from 'react-hot-toast';

interface NavbarProps {
  onMenuClick: () => void;
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isDarkTheme = false, onToggleTheme }) => {
  const navigate = useNavigate();
  const user = getAuthToken();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className={`border-b px-4 lg:px-6 py-4 ${
      isDarkTheme 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden transition-colors ${
              isDarkTheme 
                ? 'text-slate-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className={`w-64 lg:w-96 pl-10 pr-4 py-2 border rounded-lg text-bold focus:outline-none focus:ring-2 transition-all ${
                  isDarkTheme 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-transparent' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Switch */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`relative inline-flex items-center h-9 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                isDarkTheme 
                  ? 'bg-slate-700 focus:ring-offset-slate-900' 
                  : 'bg-gray-200 focus:ring-offset-white'
              }`}
              title={`Switch to ${isDarkTheme ? 'Light' : 'Dark'} Mode`}
            >
              <span className="sr-only">Toggle theme</span>
              
              {/* Toggle Circle */}
              <span
                className={`inline-flex items-center justify-center h-7 w-7 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
                  isDarkTheme ? 'translate-x-8' : 'translate-x-1'
                }`}
              >
                {isDarkTheme ? (
                  <Moon className="w-4 h-4 text-slate-700" />
                ) : (
                  <Sun className="w-4 h-4 text-orange-500" />
                )}
              </span>
              
              {/* Background Icons */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Sun className={`w-4 h-4 transition-opacity duration-300 ${
                  isDarkTheme ? 'opacity-40 text-slate-400' : 'opacity-0'
                }`} />
              </span>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Moon className={`w-4 h-4 transition-opacity duration-300 ${
                  isDarkTheme ? 'opacity-0' : 'opacity-40 text-gray-500'
                }`} />
              </span>
            </button>
          )}

          {/* Notifications */}
          <button className={`relative transition-colors ${
            isDarkTheme 
              ? 'text-slate-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center space-x-3 transition-colors ${
                isDarkTheme 
                  ? 'text-slate-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`text-xs ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-500'
                }`}>{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-xl py-1 z-50 ${
                isDarkTheme 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                    isDarkTheme 
                      ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className={`my-1 ${
                  isDarkTheme ? 'border-slate-700' : 'border-gray-200'
                }`} />
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                    isDarkTheme 
                      ? 'text-red-400 hover:bg-slate-700 hover:text-red-300' 
                      : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;