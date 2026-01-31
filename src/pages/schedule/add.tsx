import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import type { ShippingSchedule } from './index';

// Route type definition
export interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
}

// Add Shipping Schedule Component
const AddShippingSchedule: React.FC<{
  isDarkTheme: boolean;
  routes: Route[];
  onSave: (schedule: Omit<ShippingSchedule, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, routes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    scheduleTitle: '',
    routeId: '',
    startingDate: '',
    estimatedArrivalDate: '',
    status: 'Available' as 'Full' | 'Almost Full' | 'Available' | 'Completed/Closed',
    shippingStatus: 'Warehouse' as 'Warehouse' | 'Loaded' | 'In Transit' | 'Arrived'
  });

  const [errors, setErrors] = useState({
    scheduleTitle: '',
    routeId: '',
    startingDate: '',
    estimatedArrivalDate: ''
  });

  const validateForm = () => {
    const newErrors = {
      scheduleTitle: '',
      routeId: '',
      startingDate: '',
      estimatedArrivalDate: ''
    };

    // Validate schedule title
    if (!formData.scheduleTitle) {
      newErrors.scheduleTitle = 'Schedule title is required';
    }

    // Validate route
    if (!formData.routeId) {
      newErrors.routeId = 'Route is required';
    }

    // Validate starting date
    if (!formData.startingDate) {
      newErrors.startingDate = 'Starting date is required';
    }

    // Validate estimated arrival date
    if (!formData.estimatedArrivalDate) {
      newErrors.estimatedArrivalDate = 'Estimated arrival date is required';
    } else if (formData.startingDate && new Date(formData.estimatedArrivalDate) <= new Date(formData.startingDate)) {
      newErrors.estimatedArrivalDate = 'Arrival date must be after starting date';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        transitUpdates: []
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-colors ${
            isDarkTheme 
              ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Schedules
        </button>

        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Add New Shipping Schedule
          </h1>
          <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
            Create a new batch for shipping
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className={`max-w-7xl mx-auto rounded-xl p-8 ${
        isDarkTheme ? 'bg-slate-800' : 'bg-white'
      } shadow-xl`}>
        <div className="space-y-6">
          {/* Schedule Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkTheme ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Schedule Title *
            </label>
            <input
              type="text"
              value={formData.scheduleTitle}
              onChange={(e) => setFormData({ ...formData, scheduleTitle: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.scheduleTitle ? 'border-red-500' : ''}`}
              placeholder="Enter schedule title"
            />
            {errors.scheduleTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.scheduleTitle}</p>
            )}
          </div>

          {/* Route Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkTheme ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Route *
            </label>
            <select
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.routeId ? 'border-red-500' : ''}`}
            >
              <option value="">Select route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.routeName}
                </option>
              ))}
            </select>
            {errors.routeId && (
              <p className="mt-1 text-sm text-red-500">{errors.routeId}</p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starting Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Starting Date *
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <input
                  type="date"
                  value={formData.startingDate}
                  onChange={(e) => setFormData({ ...formData, startingDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.startingDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.startingDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startingDate}</p>
              )}
            </div>

            {/* Estimated Arrival Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Estimated Arrival Date *
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <input
                  type="date"
                  value={formData.estimatedArrivalDate}
                  onChange={(e) => setFormData({ ...formData, estimatedArrivalDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.estimatedArrivalDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.estimatedArrivalDate && (
                <p className="mt-1 text-sm text-red-500">{errors.estimatedArrivalDate}</p>
              )}
            </div>
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacity Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Capacity Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme 
                    ? 'bg-slate-900 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Available">Available</option>
                <option value="Almost Full">Almost Full</option>
                <option value="Full">Full</option>
                <option value="Completed/Closed">Completed/Closed</option>
              </select>
            </div>

            {/* Shipping Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Shipping Status
              </label>
              <select
                value={formData.shippingStatus}
                onChange={(e) => setFormData({ ...formData, shippingStatus: e.target.value as any })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme 
                    ? 'bg-slate-900 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Warehouse">Warehouse</option>
                <option value="Loaded">Loaded</option>
                <option value="In Transit">In Transit</option>
                <option value="Arrived">Arrived</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className={`rounded-lg p-4 ${
            isDarkTheme ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Note:</strong> Transit updates can only be added when the shipping status is "In Transit". 
              You can add these updates after creating the schedule by editing it.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Schedule
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                isDarkTheme 
                  ? 'bg-slate-700 text-white hover:bg-slate-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShippingSchedule;