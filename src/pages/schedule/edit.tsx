import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Plus, Trash2, MapPin } from 'lucide-react';
import type { ShippingSchedule } from './index';

// Route type definition
export interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
}

interface TransitUpdate {
  id: string;
  date: string;
  location: string;
  description: string;
  createdAt: string;
}

// Edit Shipping Schedule Component
const EditShippingSchedule: React.FC<{
  isDarkTheme: boolean;
  routes: Route[];
  schedule: ShippingSchedule;
  onSave: (schedule: ShippingSchedule) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, routes, schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    scheduleTitle: schedule.scheduleTitle,
    routeId: schedule.routeId,
    startingDate: schedule.startingDate,
    estimatedArrivalDate: schedule.estimatedArrivalDate,
    status: schedule.status,
    shippingStatus: schedule.shippingStatus
  });

  const [transitUpdates, setTransitUpdates] = useState<TransitUpdate[]>(schedule.transitUpdates);
  const [newUpdate, setNewUpdate] = useState({
    date: '',
    location: '',
    description: ''
  });
  const [showAddUpdate, setShowAddUpdate] = useState(false);

  const [errors, setErrors] = useState({
    scheduleTitle: '',
    routeId: '',
    startingDate: '',
    estimatedArrivalDate: '',
    updateDate: '',
    updateLocation: '',
    updateDescription: ''
  });

  const validateForm = () => {
    const newErrors = {
      scheduleTitle: '',
      routeId: '',
      startingDate: '',
      estimatedArrivalDate: '',
      updateDate: '',
      updateLocation: '',
      updateDescription: ''
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

  const validateTransitUpdate = () => {
    const newErrors = {
      scheduleTitle: '',
      routeId: '',
      startingDate: '',
      estimatedArrivalDate: '',
      updateDate: '',
      updateLocation: '',
      updateDescription: ''
    };

    if (!newUpdate.date) {
      newErrors.updateDate = 'Update date is required';
    } else {
      const updateDate = new Date(newUpdate.date);
      const startDate = new Date(formData.startingDate);
      const arrivalDate = new Date(formData.estimatedArrivalDate);
      
      if (updateDate < startDate) {
        newErrors.updateDate = 'Update date cannot be before starting date';
      } else if (updateDate > arrivalDate) {
        newErrors.updateDate = 'Update date cannot be after estimated arrival date';
      }
    }

    if (!newUpdate.location) {
      newErrors.updateLocation = 'Location is required';
    }

    if (!newUpdate.description) {
      newErrors.updateDescription = 'Description is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return !newErrors.updateDate && !newErrors.updateLocation && !newErrors.updateDescription;
  };

  const handleAddTransitUpdate = () => {
    if (validateTransitUpdate()) {
      const update: TransitUpdate = {
        id: Date.now().toString(),
        date: newUpdate.date,
        location: newUpdate.location,
        description: newUpdate.description,
        createdAt: new Date().toISOString()
      };
      
      setTransitUpdates([...transitUpdates, update]);
      setNewUpdate({ date: '', location: '', description: '' });
      setShowAddUpdate(false);
      setErrors(prev => ({ 
        ...prev, 
        updateDate: '', 
        updateLocation: '', 
        updateDescription: '' 
      }));
    }
  };

  const handleDeleteTransitUpdate = (id: string) => {
    if (confirm('Are you sure you want to delete this transit update?')) {
      setTransitUpdates(transitUpdates.filter(u => u.id !== id));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...schedule,
        ...formData,
        transitUpdates: transitUpdates
      });
    }
  };

  const isInTransit = formData.shippingStatus === 'In Transit';

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
            Edit Shipping Schedule
          </h1>
          <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
            Update schedule information and transit updates
          </p>
        </div>
      </div>

<div className="max-w-7xl mx-auto rounded-xl border p-6">
      <div className="max-w-7xl space-y-6">
        {/* Main Form Card */}
        <div className={`rounded-xl p-8 ${
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
          </div>
        </div>

        {/* Transit Updates Section - Only shown when "In Transit" */}
        {isInTransit && (
          <div className={`rounded-xl p-8 ${
            isDarkTheme ? 'bg-slate-800' : 'bg-white'
          } shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Transit Updates
                </h2>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Track the cargo's journey with location updates
                </p>
              </div>
              {!showAddUpdate && (
                <button
                  onClick={() => setShowAddUpdate(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Update
                </button>
              )}
            </div>

            {/* Add Transit Update Form */}
            {showAddUpdate && (
              <div className={`mb-6 p-6 rounded-lg border-2 border-dashed ${
                isDarkTheme ? 'border-slate-600 bg-slate-900/50' : 'border-gray-300 bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  New Transit Update
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newUpdate.date}
                        onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          isDarkTheme 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${errors.updateDate ? 'border-red-500' : ''}`}
                      />
                      {errors.updateDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.updateDate}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Location *
                      </label>
                      <input
                        type="text"
                        value={newUpdate.location}
                        onChange={(e) => setNewUpdate({ ...newUpdate, location: e.target.value })}
                        placeholder="e.g., Tanga Port, Pemba Island"
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          isDarkTheme 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${errors.updateLocation ? 'border-red-500' : ''}`}
                      />
                      {errors.updateLocation && (
                        <p className="mt-1 text-sm text-red-500">{errors.updateLocation}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Description *
                    </label>
                    <textarea
                      value={newUpdate.description}
                      onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                      placeholder="Describe the status or any notable events..."
                      rows={3}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDarkTheme 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${errors.updateDescription ? 'border-red-500' : ''}`}
                    />
                    {errors.updateDescription && (
                      <p className="mt-1 text-sm text-red-500">{errors.updateDescription}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTransitUpdate}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Add Update
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUpdate(false);
                        setNewUpdate({ date: '', location: '', description: '' });
                        setErrors(prev => ({ 
                          ...prev, 
                          updateDate: '', 
                          updateLocation: '', 
                          updateDescription: '' 
                        }));
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
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
            )}

            {/* Existing Transit Updates */}
            {transitUpdates.length === 0 ? (
              <div className={`text-center py-12 rounded-lg ${
                isDarkTheme ? 'bg-slate-900/50' : 'bg-gray-50'
              }`}>
                <MapPin className={`w-12 h-12 mx-auto mb-4 ${
                  isDarkTheme ? 'text-slate-600' : 'text-gray-400'
                }`} />
                <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  No transit updates yet. Add updates to track the cargo's journey.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transitUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((update) => (
                  <div
                    key={update.id}
                    className={`p-4 rounded-lg border ${
                      isDarkTheme 
                        ? 'bg-slate-900/50 border-slate-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className={`w-5 h-5 ${
                            isDarkTheme ? 'text-orange-400' : 'text-orange-500'
                          }`} />
                          <div>
                            <h4 className={`font-semibold ${
                              isDarkTheme ? 'text-white' : 'text-gray-900'
                            }`}>
                              {update.location}
                            </h4>
                            <p className={`text-sm ${
                              isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                            }`}>
                              {new Date(update.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <p className={`ml-8 ${
                          isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          {update.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTransitUpdate(update.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkTheme 
                            ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' 
                            : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isInTransit && (
          <div className={`rounded-lg p-4 ${
            isDarkTheme ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Note:</strong> Transit updates can only be added when the shipping status is "In Transit".
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Update Schedule
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

export default EditShippingSchedule;