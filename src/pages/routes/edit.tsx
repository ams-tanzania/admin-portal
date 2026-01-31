import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

// Station type definition
export interface Station {
  id: string;
  stationName: string;
  city: string;
  country: string;
}

// Route type definition
export interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
  createdAt: string;
}

// Edit Route Component
const EditRoutePage: React.FC<{
  isDarkTheme: boolean;
  stations: Station[];
  routes: Route[];
  route: Route;
  onSave: (route: Route) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, stations, routes, route, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    routeName: route.routeName,
    departure: route.departure,
    destination: route.destination
  });

  const [errors, setErrors] = useState({
    routeName: '',
    departure: '',
    destination: ''
  });

  const validateForm = () => {
    const newErrors = {
      routeName: '',
      departure: '',
      destination: ''
    };

    // Validate route name (check uniqueness excluding current route)
    if (!formData.routeName) {
      newErrors.routeName = 'Route name is required';
    } else if (routes.some(r => r.id !== route.id && r.routeName.toLowerCase() === formData.routeName.toLowerCase())) {
      newErrors.routeName = 'Route name must be unique';
    }

    // Validate departure
    if (!formData.departure) {
      newErrors.departure = 'Departure station is required';
    }

    // Validate destination
    if (!formData.destination) {
      newErrors.destination = 'Destination station is required';
    } else if (formData.departure === formData.destination) {
      newErrors.destination = 'Destination must be different from departure';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...route,
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
          Back to Routes
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Edit Route
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Update route information
        </p>
      </div>

<div className="max-w-7xl mx-auto rounded-xl border p-6">
      {/* Form Card */}
      <div className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Route Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.routeName}
              onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.routeName ? 'border-red-500' : ''}`}
              placeholder="Enter route name"
            />
            {errors.routeName && (
              <p className="mt-1 text-sm text-red-500">{errors.routeName}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Departure Station <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.departure}
              onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.departure ? 'border-red-500' : ''}`}
            >
              <option value="">Select departure station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.stationName} - {station.city}
                </option>
              ))}
            </select>
            {errors.departure && (
              <p className="mt-1 text-sm text-red-500">{errors.departure}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Destination Station <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.destination ? 'border-red-500' : ''}`}
            >
              <option value="">Select destination station</option>
              {stations.map((station) => (
                <option 
                  key={station.id} 
                  value={station.id}
                  disabled={station.id === formData.departure}
                >
                  {station.stationName} - {station.city}
                </option>
              ))}
            </select>
            {errors.destination && (
              <p className="mt-1 text-sm text-red-500">{errors.destination}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Update Route
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

export default EditRoutePage;