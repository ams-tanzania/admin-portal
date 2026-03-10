import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, User as UserIcon, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import { createShipment } from '../api/api_services/shipment';
import type { Batch } from '../api/api_services/batch';
import type { Customer } from '../api/api_services/customer'; // adjust if needed

interface CreateShipmentPageProps {
  isDarkTheme: boolean;
  batches: Batch[];
  customers: Customer[];
  onSave: () => void;
  onCancel: () => void;
}

const CreateShipmentPage: React.FC<CreateShipmentPageProps> = ({
  isDarkTheme, batches, customers, onSave, onCancel,
}) => {
 const user = JSON.parse(localStorage.getItem('user') || '{}');
const staffId = user.staff_id || '';

  const [formData, setFormData] = useState({
    customer_id: '',
    batch_id: '',
    description: '',
    estimated_cbm: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCustomers = customers.filter(c =>
    c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === formData.customer_id);
  const selectedBatch = batches.find(b => b.id === formData.batch_id);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
    if (!formData.batch_id) newErrors.batch_id = 'Batch is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.estimated_cbm) newErrors.estimated_cbm = 'Estimated CBM is required';
    else if (isNaN(Number(formData.estimated_cbm)) || Number(formData.estimated_cbm) <= 0)
      newErrors.estimated_cbm = 'Must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createShipment({
        customer_id: formData.customer_id,
        batch_id: formData.batch_id,
        description: formData.description,
        platform: 'web',
        estimated_cbm: Number(formData.estimated_cbm),
        image: imageFile || undefined,
        staff_id: staffId,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Shipment Created!',
        text: 'The shipment has been created successfully.',
        confirmButtonColor: '#f97316',
        timer: 2000,
        showConfirmButton: false,
      });
      onSave();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.response?.data?.message || 'Failed to create shipment',
        confirmButtonColor: '#f97316',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    } ${errors[field] ? 'border-red-500' : ''}`;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <button onClick={onCancel} className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Shipments
        </button>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Create Shipment</h1>
        <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Fill in the details to create a new shipment</p>
      </div>

      <div className={`max-w-5xl mx-auto rounded-xl border p-8 space-y-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-xl`}>

        {/* Customer */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
            Customer <span className="text-red-500">*</span>
          </label>

          {/* Show selected customer */}
          {selectedCustomer ? (
            <div className={`flex items-center justify-between p-3 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-600' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {(selectedCustomer.full_name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-medium text-sm ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.full_name}</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => { setFormData(f => ({ ...f, customer_id: '' })); setCustomerSearch(''); }} className="text-red-400 hover:text-red-500 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search customer by name, email or phone..."
                value={customerSearch}
                onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                onFocus={() => setShowCustomerDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 150)}
                className={`w-full pl-9 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${errors.customer_id ? 'border-red-500' : ''}`}
              />
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div ref={dropdownRef} className={`absolute z-20 w-full mt-1 rounded-xl border shadow-xl max-h-56 overflow-y-auto ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      onMouseDown={() => { setFormData(f => ({ ...f, customer_id: c.id })); setCustomerSearch(''); setShowCustomerDropdown(false); }}
                      className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${isDarkTheme ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(c.full_name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{c.full_name}</p>
                        <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>{c.email} • {c.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {errors.customer_id && <p className="mt-1 text-sm text-red-500">{errors.customer_id}</p>}
        </div>

        {/* Batch */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
            Batch <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.batch_id}
            onChange={e => setFormData(f => ({ ...f, batch_id: e.target.value }))}
            className={inputClass('batch_id')}
          >
            <option value="">Select a batch</option>
            {batches.filter(b => b.status !== 'completed' && b.status !== 'full').map(b => (
              <option key={b.id} value={b.id}>
                {b.batch_number} — {b.origin_branch} → {b.destination_branch} ({b.status})
              </option>
            ))}
          </select>
          {errors.batch_id && <p className="mt-1 text-sm text-red-500">{errors.batch_id}</p>}
          {selectedBatch && (
            <div className={`mt-2 p-3 rounded-lg text-sm flex items-center gap-4 ${isDarkTheme ? 'bg-slate-900 text-slate-300' : 'bg-gray-50 text-gray-600'}`}>
              <span>🚢 {selectedBatch.route}</span>
              <span>📅 Departs {new Date(selectedBatch.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>📦 {parseFloat(selectedBatch.capacity_in_cbm).toLocaleString()} CBM capacity</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Describe the shipment contents..."
            className={inputClass('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Estimated CBM */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
            Estimated CBM <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Package className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.estimated_cbm}
              onChange={e => setFormData(f => ({ ...f, estimated_cbm: e.target.value }))}
              placeholder="e.g. 2.5"
              className={`${inputClass('estimated_cbm')} pl-9`}
            />
          </div>
          {errors.estimated_cbm && <p className="mt-1 text-sm text-red-500">{errors.estimated_cbm}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
            Shipment Image <span className={`text-xs font-normal ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>(optional)</span>
          </label>
          {imagePreview ? (
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-orange-400">
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow"
              ><X className="w-3 h-3" /></button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              isDarkTheme ? 'border-slate-600 hover:border-orange-500 bg-slate-900' : 'border-gray-300 hover:border-orange-400 bg-gray-50'
            }`}>
              <Upload className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Click to upload image</p>
              <p className={`text-xs mt-1 ${isDarkTheme ? 'text-slate-600' : 'text-gray-400'}`}>JPG, PNG, WEBP</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Creating...' : 'Create Shipment'}
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
  );
};

export default CreateShipmentPage;