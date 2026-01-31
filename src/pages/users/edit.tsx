import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import type { User as UserType } from './index';

// Edit User Component
const EditUser: React.FC<{
  isDarkTheme: boolean;
  user: UserType;
  onSave: (user: UserType) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phone: user.phone,
    location: user.location,
    email: user.email,
    role: user.role
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    location: '',
    email: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: formData.fullName ? '' : 'Full name is required',
      phone: '',
      location: formData.location ? '' : 'Location is required',
      email: ''
    };

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...user,
        ...formData
      });
    }
  };

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? 'text-slate-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Edit User
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Update user information
        </p>
      </div>

<div className="max-w-7xl mx-auto rounded-xl border p-6">
      {/* Form Card */}
      <div className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            
            {/* Full Name */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="City, Country"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+255 712 345 678"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role <span className="text-red-500">*</span>
              </div>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserType['role'] })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Guest">Guest</option>
            </select>
            <p className={`mt-2 text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
              Select the appropriate role for this user
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Update User
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium border transition-colors ${
                isDarkTheme
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EditUser;