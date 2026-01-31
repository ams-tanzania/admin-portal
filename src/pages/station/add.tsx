import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

// Station type definition
export interface Station {
  id: string;
  stationName: string;
  city: string;
  country: string;
  createdAt: string;
}

// Add Station Component
const AddStationPage: React.FC<{
  isDarkTheme: boolean;
  onSave: (station: Omit<Station, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    stationName: '',
    city: '',
    country: ''
  });

  const [errors, setErrors] = useState({
    stationName: '',
    city: '',
    country: ''
  });

  const validateForm = () => {
    const newErrors = {
      stationName: formData.stationName ? '' : 'Station name is required',
      city: formData.city ? '' : 'City is required',
      country: formData.country ? '' : 'Country is required'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
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
          Back to Stations
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Add New Station
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Create a new shipping station
        </p>
      </div>

<div className="max-w-7xl mx-auto rounded-xl border p-6">
      {/* Form Card */}
      <div className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Station Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.stationName}
              onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.stationName ? 'border-red-500' : ''}`}
              placeholder="Enter station name"
            />
            {errors.stationName && (
              <p className="mt-1 text-sm text-red-500">{errors.stationName}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Enter city name"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.country ? 'border-red-500' : ''}`}
              placeholder="Enter country name"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Station
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

export default AddStationPage;