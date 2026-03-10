import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { createRoute, type CreateRoutePayload } from '../api/api_services/routes';
import { type Branch } from '../api/api_services/branch';

const AddRoute: React.FC<{
  isDarkTheme: boolean;
  branches: Branch[];
  onSave: () => void;
  onCancel: () => void;
}> = ({ isDarkTheme, branches, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CreateRoutePayload>({
    name: '',
    origin_branch_id: '',
    destination_branch_id: '',
    estimated_duration_hours: 24,
  });

  const [errors, setErrors] = useState({
    name: '',
    origin_branch_id: '',
    destination_branch_id: '',
    estimated_duration_hours: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = { name: '', origin_branch_id: '', destination_branch_id: '', estimated_duration_hours: '' };
    if (!formData.name.trim()) newErrors.name = 'Route name is required';
    if (!formData.origin_branch_id) newErrors.origin_branch_id = 'Origin branch is required';
    if (!formData.destination_branch_id) newErrors.destination_branch_id = 'Destination branch is required';
    else if (formData.origin_branch_id === formData.destination_branch_id)
      newErrors.destination_branch_id = 'Destination must differ from origin';
    if (!formData.estimated_duration_hours || formData.estimated_duration_hours <= 0)
      newErrors.estimated_duration_hours = 'Duration must be greater than 0';
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createRoute(formData);
      onSave();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create route');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
    } ${errors[field as keyof typeof errors] ? 'border-red-500' : ''}`;

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Routes
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Add New Route</h1>
        <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Create a new shipping route</p>
      </div>

      <div className={`max-w-5xl mx-auto rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          {/* Route Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Route Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={inputClass('name')}
              placeholder="e.g. Main Route"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Origin Branch */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Origin Branch <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.origin_branch_id}
              onChange={e => setFormData({ ...formData, origin_branch_id: e.target.value })}
              className={inputClass('origin_branch_id')}
            >
              <option value="">Select origin branch</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
              ))}
            </select>
            {errors.origin_branch_id && <p className="mt-1 text-sm text-red-500">{errors.origin_branch_id}</p>}
          </div>

          {/* Destination Branch */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Destination Branch <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.destination_branch_id}
              onChange={e => setFormData({ ...formData, destination_branch_id: e.target.value })}
              className={inputClass('destination_branch_id')}
            >
              <option value="">Select destination branch</option>
              {branches.map(b => (
                <option key={b.id} value={b.id} disabled={b.id === formData.origin_branch_id}>
                  {b.name} — {b.city}
                </option>
              ))}
            </select>
            {errors.destination_branch_id && <p className="mt-1 text-sm text-red-500">{errors.destination_branch_id}</p>}
          </div>

          {/* Estimated Duration */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Estimated Duration (hours) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={formData.estimated_duration_hours}
              onChange={e => setFormData({ ...formData, estimated_duration_hours: Number(e.target.value) })}
              className={inputClass('estimated_duration_hours')}
              placeholder="e.g. 72"
            />
            {errors.estimated_duration_hours && <p className="mt-1 text-sm text-red-500">{errors.estimated_duration_hours}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Route'}
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium border transition-colors ${
                isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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

export default AddRoute;