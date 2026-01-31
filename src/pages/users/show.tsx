import React from 'react';
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Shield, User as UserIcon, Info } from 'lucide-react';
import type { User } from './index';

// Show User Component
const ShowUser: React.FC<{
  isDarkTheme: boolean;
  user: User;
  onBack: () => void;
  onEdit: () => void;
}> = ({ isDarkTheme, user, onBack, onEdit }) => {
  
  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'User':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Guest':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleColorDark = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'Manager':
        return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'User':
        return 'bg-green-900/30 text-green-400 border-green-800';
      case 'Guest':
        return 'bg-gray-900/30 text-gray-400 border-gray-800';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDescription = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'Full system access with administrative privileges';
      case 'Manager':
        return 'Elevated permissions for team management';
      case 'User':
        return 'Standard user access with basic permissions';
      case 'Guest':
        return 'Limited access for temporary or guest users';
      default:
        return 'Standard user permissions';
    }
  };

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? 'text-slate-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              User Profile
            </h1>
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              View complete user information
            </p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit User
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                {getInitials(user.fullName)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {user.fullName}
                    </h2>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                      Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                    isDarkTheme ? getRoleColorDark(user.role) : getRoleColor(user.role)
                  }`}>
                    <Shield className="w-4 h-4 mr-2" />
                    {user.role}
                  </span>
                </div>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  {getRoleDescription(user.role)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Info className="w-5 h-5" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkTheme ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <Mail className={`w-6 h-6 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Email Address
                  </p>
                  <a 
                    href={`mailto:${user.email}`}
                    className={`text-lg font-semibold hover:underline ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
                  >
                    {user.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkTheme ? 'bg-green-900/30' : 'bg-green-100'}`}>
                  <Phone className={`w-6 h-6 ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Phone Number
                  </p>
                  <a 
                    href={`tel:${user.phone}`}
                    className={`text-lg font-semibold hover:underline ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
                  >
                    {user.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkTheme ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                  <MapPin className={`w-6 h-6 ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Location
                  </p>
                  <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {user.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <UserIcon className="w-5 h-5" />
              Account Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  User ID
                </p>
                <p className={`text-lg font-mono font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  #{user.id}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Account Type
                </p>
                <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {user.role}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Created Date
                </p>
                <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Account Status
                </p>
                <p className={`text-lg font-semibold ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={onEdit}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>

              <a
                href={`mailto:${user.email}`}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>

              <a
                href={`tel:${user.phone}`}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                Call User
              </a>

              <button
                onClick={onBack}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>
          </div>

          {/* Role Information Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Shield className="w-5 h-5" />
              Role & Permissions
            </h3>
            
            <div className={`p-4 rounded-xl mb-4 ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Current Role
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  isDarkTheme ? getRoleColorDark(user.role) : getRoleColor(user.role)
                }`}>
                  {user.role}
                </span>
              </div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                {getRoleDescription(user.role)}
              </p>
            </div>

            {/* Permission Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  View Access
                </span>
                <span className={`text-sm font-semibold ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ Granted
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Edit Access
                </span>
                <span className={`text-sm font-semibold ${user.role !== 'Guest' ? (isDarkTheme ? 'text-green-400' : 'text-green-600') : (isDarkTheme ? 'text-red-400' : 'text-red-600')}`}>
                  {user.role !== 'Guest' ? '✓ Granted' : '✗ Denied'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Admin Access
                </span>
                <span className={`text-sm font-semibold ${user.role === 'Admin' ? (isDarkTheme ? 'text-green-400' : 'text-green-600') : (isDarkTheme ? 'text-red-400' : 'text-red-600')}`}>
                  {user.role === 'Admin' ? '✓ Granted' : '✗ Denied'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;