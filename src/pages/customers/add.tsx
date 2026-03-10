import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Building2, Lock, Loader2 } from 'lucide-react';
import { createCustomer } from '../api/api_services/customer';

const AddCustomer: React.FC<{
  isDarkTheme: boolean;
  onSave: () => void;
  onCancel: () => void;
}> = ({ isDarkTheme, onSave, onCancel }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    address: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      await createCustomer({
        ...formData,
        staff_id: user.staff_id,
        platform: 'web',
      });
      onSave();
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  const field = (
    key: keyof typeof formData,
    label: string,
    placeholder: string,
    Icon: React.ElementType,
    type = 'text'
  ) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
        <input
          type={type}
          value={formData[key]}
          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } ${errors[key] ? 'border-red-500' : ''}`}
        />
      </div>
      {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <button onClick={onCancel} className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Add New Customer</h1>
        <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Register a new customer account</p>
      </div>

      <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {apiError}
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Info */}
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('full_name', 'Full Name', 'Summayya Almas', User)}
              {field('company_name', 'Company Name (optional)', 'Company Ltd', Building2)}
            </div>
          </div>

          {/* Account Info */}
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <Mail className="w-4 h-4" /> Account Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('email', 'Email', 'customer@mail.com', Mail, 'email')}
              {field('password', 'Password', 'Min 6 characters', Lock, 'password')}
            </div>
          </div>

          {/* Contact */}
          <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              <Phone className="w-4 h-4" /> Contact & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('phone', 'Phone', '0712345678', Phone, 'tel')}
              {field('address', 'Address', 'PLI012, Street Name', MapPin)}
              {field('city', 'City', 'Dar Es Salaam', MapPin)}
              {field('country', 'Country', 'Tanzania', MapPin)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isLoading ? 'Saving...' : 'Save Customer'}
            </button>
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium border transition-colors ${isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;