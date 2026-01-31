import React, { useState } from 'react';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import type { ShippingRequest } from './index';

interface EditRequestPageProps {
  isDarkTheme: boolean;
  request: ShippingRequest;
  onSave: (request: ShippingRequest) => void;
  onCancel: () => void;
}

const EditRequestPage: React.FC<EditRequestPageProps> = ({ isDarkTheme, request, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    status: request.status,
    paymentStatus: request.paymentStatus
  });

  const canEditStatus = request.status !== 'Accepted';
  const canEditPayment = request.paymentStatus !== 'Paid';

  const handleSubmit = () => {
    const updatedRequest: ShippingRequest = {
      ...request,
      status: formData.status,
      paymentStatus: formData.paymentStatus
    };
    onSave(updatedRequest);
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
          Back
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Edit Shipping Request
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Update status and payment information for request ID: #{request.id}
        </p>
      </div>
<div className="max-w-7xl mx-auto rounded-xl border p-6">
      <div className={`max-w-7xl rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="space-y-6">
          {/* Info Notice */}
          <div className={`p-4 rounded-lg border ${
            isDarkTheme ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Note:</strong> Only status and payment information can be edited. Once a request is accepted or payment is made, those fields cannot be changed.
            </p>
          </div>

          {/* Read-only Request Information */}
          <div className={`p-6 rounded-xl border ${
            isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Request Information (Read-only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Batch
                </label>
                <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.batchTitle}
                </p>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Customer Name
                </label>
                <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.customerName}
                </p>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Route
                </label>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  {request.departure} → {request.destination}
                </p>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Cargo
                </label>
                <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.cargoName}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Description
                </label>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  {request.description}
                </p>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Request Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Accepted' | 'Rejected' })}
                  disabled={!canEditStatus}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${!canEditStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {!canEditStatus && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className={`w-4 h-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
              {!canEditStatus && (
                <p className={`mt-1 text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  Status is locked once accepted
                </p>
              )}
            </div>

            {/* Payment Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Payment Status
              </label>
              <div className="relative">
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'Paid' | 'Unpaid' })}
                  disabled={!canEditPayment}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${!canEditPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
                {!canEditPayment && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className={`w-4 h-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
              {!canEditPayment && (
                <p className={`mt-1 text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  Payment is locked once paid
                </p>
              )}
            </div>
          </div>

          {/* Warning if nothing can be edited */}
          {!canEditStatus && !canEditPayment && (
            <div className={`p-4 rounded-lg border ${
              isDarkTheme ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <p className={`text-sm ${isDarkTheme ? 'text-yellow-300' : 'text-yellow-700'}`}>
                <strong>⚠️ Warning:</strong> This request is fully locked. The status is accepted and payment is completed. No changes can be made.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!canEditStatus && !canEditPayment}
              className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 ${
                !canEditStatus && !canEditPayment
                  ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
              }`}
            >
              <Save className="w-5 h-5" />
              Update Request
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
    </div>
  );
};

export default EditRequestPage;