import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Home, Building2, MapPin, Plus, X, User as UserIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import type { ShippingRequest, ShippingSchedule } from './index';

// Import User type from users page
interface User {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User' | 'Customer' | 'Guest';
  createdAt: string;
}

interface CreateRequestPageProps {
  isDarkTheme: boolean;
  schedules: ShippingSchedule[];
  onSave: (request: Omit<ShippingRequest, 'id' | 'createdAt' | 'updatedAt'>) => ShippingRequest;
  onCancel: () => void;
}

const CreateRequestPage: React.FC<CreateRequestPageProps> = ({ isDarkTheme, schedules, onSave, onCancel }) => {
  // Sample users data - In production, fetch this from your users API/state
  const [users] = useState<User[]>([
    {
      id: '1',
      fullName: 'John Mwangi',
      phone: '+255 712 345 678',
      location: 'Dar es Salaam, Tanzania',
      email: 'john.mwangi@email.com',
      role: 'Customer',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      fullName: 'Amina Hassan',
      phone: '+255 723 456 789',
      location: 'Zanzibar, Tanzania',
      email: 'amina.hassan@email.com',
      role: 'Customer',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      fullName: 'David Kamau',
      phone: '+254 720 123 456',
      location: 'Mombasa, Kenya',
      email: 'david.kamau@email.com',
      role: 'Customer',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      fullName: 'Fatuma Said',
      phone: '+255 745 678 901',
      location: 'Arusha, Tanzania',
      email: 'fatuma.said@email.com',
      role: 'Customer',
      createdAt: '2024-02-05'
    },
    {
      id: '5',
      fullName: 'Michael Ochieng',
      phone: '+254 711 222 333',
      location: 'Nairobi, Kenya',
      email: 'michael.ochieng@email.com',
      role: 'Customer',
      createdAt: '2024-02-10'
    }
  ]);

  const [formData, setFormData] = useState({
    batchId: '',
    customerName: '',
    pickupLocation: 'home' as 'home' | 'office',
    pickupAddress: '',
    deliveryLocation: 'home' as 'home' | 'office',
    deliveryAddress: '',
    cargoName: '',
    description: '',
    status: 'Accepted' as 'Accepted' | 'Rejected',
    paymentStatus: 'Unpaid' as 'Paid' | 'Unpaid'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // New customer form data
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    phone: '',
    location: '',
    email: ''
  });

  const selectedBatch = schedules.find(s => s.id === formData.batchId);

  // Filter users based on input - show all when empty
  useEffect(() => {
    if (formData.customerName.trim()) {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(formData.customerName.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      // Show all users when input is empty
      setFilteredUsers(users);
    }
  }, [formData.customerName, users]);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.batchId) newErrors.batchId = 'Batch is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.cargoName.trim()) newErrors.cargoName = 'Cargo name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (formData.pickupLocation === 'home' && !formData.pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pickup address is required for home pickup';
    }
    if (formData.deliveryLocation === 'home' && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required for home delivery';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewCustomer = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newCustomer.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!newCustomer.phone.trim()) newErrors.phone = 'Phone is required';
    if (!newCustomer.location.trim()) newErrors.location = 'Location is required';
    if (!newCustomer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newCustomer.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewCustomer = () => {
    if (validateNewCustomer()) {
      // In production, you would save this to your users API/state
      Swal.fire({
        icon: 'success',
        title: 'Customer Added!',
        text: `${newCustomer.fullName} has been added to the system`,
        confirmButtonColor: '#f97316',
        timer: 2000
      });
      
      // Set the customer name in the form
      setFormData({ ...formData, customerName: newCustomer.fullName });
      
      // Reset and close modal
      setNewCustomer({ fullName: '', phone: '', location: '', email: '' });
      setShowAddCustomerModal(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const batch = schedules.find(s => s.id === formData.batchId)!;
      const requestData: any = {
        batchId: formData.batchId,
        batchTitle: batch.scheduleTitle,
        routeName: batch.routeName,
        departure: batch.departure,
        destination: batch.destination,
        customerName: formData.customerName,
        pickupLocation: formData.pickupLocation,
        deliveryLocation: formData.deliveryLocation,
        cargoName: formData.cargoName,
        description: formData.description,
        status: formData.status,
        paymentStatus: formData.paymentStatus
      };

      if (formData.pickupLocation === 'home') {
        requestData.pickupAddress = formData.pickupAddress;
      }
      if (formData.deliveryLocation === 'home') {
        requestData.deliveryAddress = formData.deliveryAddress;
      }

      // Call onSave which now returns the created request
      const createdRequest = onSave(requestData);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Request Created!',
        text: 'Shipping request has been created successfully',
        confirmButtonColor: '#f97316',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const selectUser = (user: User) => {
    setFormData({ ...formData, customerName: user.fullName });
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Create Shipping Request
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Fill in the details for the new shipping request
        </p>
      </div>

      <div className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          {/* Batch Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Shipping Batch <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              } ${errors.batchId ? 'border-red-500' : ''}`}
            >
              <option value="">Select a batch</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.scheduleTitle} - {schedule.routeName}
                </option>
              ))}
            </select>
            {errors.batchId && <p className="mt-1 text-sm text-red-500">{errors.batchId}</p>}
            
            {/* Show Departure and Destination when batch is selected */}
            {selectedBatch && (
              <div className={`mt-3 p-4 rounded-lg border ${
                isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400' : 'text-blue-500'}`} />
                    <div>
                      <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>Departure</p>
                      <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{selectedBatch.departure}</p>
                    </div>
                  </div>
                  <div className={`text-2xl ${isDarkTheme ? 'text-slate-600' : 'text-gray-400'}`}>→</div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isDarkTheme ? 'text-green-400' : 'text-green-500'}`} />
                    <div>
                      <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>Destination</p>
                      <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{selectedBatch.destination}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Name with Datalist and Add Button */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData({ ...formData, customerName: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.customerName ? 'border-red-500' : ''}`}
                  placeholder="Type to search or enter customer name"
                  autoComplete="off"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredUsers.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className={`absolute z-10 w-full mt-1 rounded-xl border shadow-lg max-h-60 overflow-y-auto ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          selectUser(user);
                        }}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          isDarkTheme ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                              {user.fullName}
                            </p>
                            <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                              {user.phone} • {user.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                title="Add New Customer"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
            {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
          </div>

          {/* Pickup Location */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.pickupLocation === 'home' ? 'border-orange-500 bg-orange-500' : isDarkTheme ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  {formData.pickupLocation === 'home' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                <Home className="w-5 h-5 text-orange-500" />
                <span className={`font-medium ${formData.pickupLocation === 'home' ? 'text-orange-500' : isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  From Home
                </span>
                <input
                  type="radio"
                  name="pickupLocation"
                  value="home"
                  checked={formData.pickupLocation === 'home'}
                  onChange={() => setFormData({ ...formData, pickupLocation: 'home' })}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.pickupLocation === 'office' ? 'border-orange-500 bg-orange-500' : isDarkTheme ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  {formData.pickupLocation === 'office' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                <Building2 className="w-5 h-5 text-orange-500" />
                <span className={`font-medium ${formData.pickupLocation === 'office' ? 'text-orange-500' : isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  From Office
                </span>
                <input
                  type="radio"
                  name="pickupLocation"
                  value="office"
                  checked={formData.pickupLocation === 'office'}
                  onChange={() => setFormData({ ...formData, pickupLocation: 'office' })}
                  className="hidden"
                />
              </label>
            </div>
            {formData.pickupLocation === 'home' && (
              <div>
                <input
                  type="text"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.pickupAddress ? 'border-red-500' : ''}`}
                  placeholder="Enter pickup address"
                />
                {errors.pickupAddress && <p className="mt-1 text-sm text-red-500">{errors.pickupAddress}</p>}
              </div>
            )}
          </div>

          {/* Delivery Location */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.deliveryLocation === 'home' ? 'border-orange-500 bg-orange-500' : isDarkTheme ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  {formData.deliveryLocation === 'home' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                <Home className="w-5 h-5 text-orange-500" />
                <span className={`font-medium ${formData.deliveryLocation === 'home' ? 'text-orange-500' : isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  To Home
                </span>
                <input
                  type="radio"
                  name="deliveryLocation"
                  value="home"
                  checked={formData.deliveryLocation === 'home'}
                  onChange={() => setFormData({ ...formData, deliveryLocation: 'home' })}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.deliveryLocation === 'office' ? 'border-orange-500 bg-orange-500' : isDarkTheme ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  {formData.deliveryLocation === 'office' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                <Building2 className="w-5 h-5 text-orange-500" />
                <span className={`font-medium ${formData.deliveryLocation === 'office' ? 'text-orange-500' : isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  At Office
                </span>
                <input
                  type="radio"
                  name="deliveryLocation"
                  value="office"
                  checked={formData.deliveryLocation === 'office'}
                  onChange={() => setFormData({ ...formData, deliveryLocation: 'office' })}
                  className="hidden"
                />
              </label>
            </div>
            {formData.deliveryLocation === 'home' && (
              <div>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                  placeholder="Enter delivery address"
                />
                {errors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>}
              </div>
            )}
          </div>

          {/* Cargo Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Cargo Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.cargoName}
              onChange={(e) => setFormData({ ...formData, cargoName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              } ${errors.cargoName ? 'border-red-500' : ''}`}
              placeholder="e.g., Electronics, Furniture, Textiles"
            />
            {errors.cargoName && <p className="mt-1 text-sm text-red-500">{errors.cargoName}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              } ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe the cargo in detail..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Accepted' | 'Rejected' })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'Paid' | 'Unpaid' })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Submit Request
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

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Add New Customer
              </h2>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCustomer.fullName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="+255 XXX XXX XXX"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="customer@email.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddNewCustomer}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Add Customer
                </button>
                <button
                  onClick={() => setShowAddCustomerModal(false)}
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
      )}
    </div>
  );
};

export default CreateRequestPage;