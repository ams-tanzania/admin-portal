import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { createBatch, type CreateBatchPayload } from '../api/api_services/batch';
import { type Route } from '../api/api_services/routes';

const AddShippingSchedule: React.FC<{

  isDarkTheme: boolean;
  routes: Route[];
  onSave: () => void;
  onCancel: () => void;
}> = ({ isDarkTheme, routes, onSave, onCancel }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState<CreateBatchPayload>({
    route_id: '',
    departure_date: '',
    estimated_arrival_date: '',
    capacity_in_cbm: 0,
    staff_id: user.staff_id || '',
  });

  const [errors, setErrors] = useState({
    route_id: '',
    departure_date: '',
    estimated_arrival_date: '',
    capacity_in_cbm: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = { route_id: '', departure_date: '', estimated_arrival_date: '', capacity_in_cbm: '' };
    if (!formData.route_id) e.route_id = 'Route is required';
    if (!formData.departure_date) e.departure_date = 'Departure date is required';
    if (!formData.estimated_arrival_date) {
      e.estimated_arrival_date = 'Estimated arrival date is required';
    } else if (formData.departure_date && new Date(formData.estimated_arrival_date) <= new Date(formData.departure_date)) {
      e.estimated_arrival_date = 'Arrival date must be after departure date';
    }
    if (!formData.capacity_in_cbm || formData.capacity_in_cbm <= 0) {
      e.capacity_in_cbm = 'Capacity must be greater than 0';
    }
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createBatch(formData); 
      onSave();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
    } ${errors[field as keyof typeof errors] ? 'border-red-500' : ''}`;

  const labelClass = `block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-colors ${
            isDarkTheme ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Schedules
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Add New Batch</h1>
        <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Create a new shipping batch</p>
      </div>

      <div className={`max-w-2xl rounded-xl p-8 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="space-y-6">
          {/* Route */}
          <div>
            <label className={labelClass}>Route <span className="text-red-500">*</span></label>
            <select
              value={formData.route_id}
              onChange={e => setFormData({ ...formData, route_id: e.target.value })}
              className={inputClass('route_id')}
            >
              <option value="">Select route</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.route_id && <p className="mt-1 text-sm text-red-500">{errors.route_id}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Departure Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={formData.departure_date}
                  onChange={e => setFormData({ ...formData, departure_date: e.target.value })}
                  className={`${inputClass('departure_date')} pl-10`}
                />
              </div>
              {errors.departure_date && <p className="mt-1 text-sm text-red-500">{errors.departure_date}</p>}
            </div>
            <div>
              <label className={labelClass}>Estimated Arrival Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={formData.estimated_arrival_date}
                  onChange={e => setFormData({ ...formData, estimated_arrival_date: e.target.value })}
                  className={`${inputClass('estimated_arrival_date')} pl-10`}
                />
              </div>
              {errors.estimated_arrival_date && <p className="mt-1 text-sm text-red-500">{errors.estimated_arrival_date}</p>}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className={labelClass}>Capacity (CBM) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min={1}
              value={formData.capacity_in_cbm || ''}
              onChange={e => setFormData({ ...formData, capacity_in_cbm: Number(e.target.value) })}
              className={inputClass('capacity_in_cbm')}
              placeholder="e.g. 900"
            />
            {errors.capacity_in_cbm && <p className="mt-1 text-sm text-red-500">{errors.capacity_in_cbm}</p>}
          </div>

          {/* Info Box */}
          <div className={`rounded-lg p-4 ${isDarkTheme ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Note:</strong> The batch number will be auto-generated by the system upon creation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Batch'}
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                isDarkTheme ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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