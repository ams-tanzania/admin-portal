import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Station from "./index";

// Edit Station Component
export interface Station {
  id: string;
  stationName: string;
  city: string;
  country: string;
  createdAt: string;
}

const EditStation: React.FC<{
  isDarkTheme: boolean;
  station: Station;
  onSave: (station: Station) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, station, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    stationName: station.stationName,
    city: station.city,
    country: station.country,
  });

  const handleSubmit = () => {
    onSave({
      ...station,
      ...formData,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? "text-slate-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stations
        </button>
        <h1
          className={`text-3xl font-bold mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
        >
          Edit Station
        </h1>
        <p className={`${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}>
          Update station information
        </p>
      </div>

<div className="max-w-7xl mx-auto rounded-xl border p-6">
      <div
        className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
      >
        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
            >
              Station Name *
            </label>
            <input
              type="text"
              required
              value={formData.stationName}
              onChange={(e) =>
                setFormData({ ...formData, stationName: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
            >
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
            >
              Country *
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Update Station
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium border transition-colors ${
                isDarkTheme
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
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

export default EditStation;
