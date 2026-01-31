import React from 'react';
import { Package, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import type { ShippingRequest } from '../../types';
import { formatDateTime } from '../utils/validation';
import toast from 'react-hot-toast';

interface PendingRequestsProps {
  requests: ShippingRequest[];
  isDarkTheme?: boolean;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ requests, isDarkTheme = false }) => {
  const pendingRequests = requests.filter(req => req.status === 'pending');

  const handleApprove = (requestId: string) => {
    toast.success('Request approved successfully');
  };

  const handleReject = (requestId: string) => {
    toast.error('Request rejected');
  };

  return (
    <div className={`border rounded-xl p-6 ${
      isDarkTheme 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>Pending Requests</h2>
        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
          {pendingRequests.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <Package className={`w-12 h-12 mx-auto mb-3 ${
              isDarkTheme ? 'text-slate-600' : 'text-gray-400'
            }`} />
            <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>
              No pending requests
            </p>
          </div>
        ) : (
          pendingRequests.slice(0, 5).map((request) => (
            <div
              key={request.id}
              className={`border rounded-lg p-4 transition-all ${
                isDarkTheme 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      }`}>{request.customerName}</h3>
                      <span className={isDarkTheme ? 'text-slate-500' : 'text-gray-400'}>•</span>
                      <span className={`text-sm ${
                        isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                      }`}>{request.cargoDescription}</span>
                    </div>
                    <div className={`flex items-center space-x-4 text-sm ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{request.customerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(request.requestDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 mb-3 ${
                isDarkTheme ? 'bg-slate-700/30' : 'bg-gray-100'
              }`}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className={`mb-1 ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>Pickup</p>
                    <p className={`font-medium ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>{request.pickupLocation}</p>
                  </div>
                  <div>
                    <p className={`mb-1 ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>Delivery</p>
                    <p className={`font-medium ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>{request.deliveryLocation}</p>
                  </div>
                  <div>
                    <p className={`mb-1 ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>Weight</p>
                    <p className={`font-medium ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>{request.cargoWeight} kg</p>
                  </div>
                  <div>
                    <p className={`mb-1 ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>Quantity</p>
                    <p className={`font-medium ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>{request.cargoQuantity} items</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Approve</span>
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium">Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingRequests;