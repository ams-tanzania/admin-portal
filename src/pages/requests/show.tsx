import React from 'react';
import { ArrowLeft, Edit2, User, MapPin, Package, Home, Building2, Calendar, Clock, Ship } from 'lucide-react';
import type { ShippingRequest } from './index';

interface ShowRequestPageProps {
  isDarkTheme: boolean;
  request: ShippingRequest;
  onEdit: () => void;
  onBack: () => void;
}

const ShowRequestPage: React.FC<ShowRequestPageProps> = ({ isDarkTheme, request, onEdit, onBack }) => {
  const getStatusBadge = (status: string, type: 'status' | 'payment') => {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-semibold';
    
    if (type === 'status') {
      return status === 'Accepted' 
        ? `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
        : `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
    }
    
    if (type === 'payment') {
      return status === 'Paid'
        ? `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
        : `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`;
    }
    
    return baseClasses;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Request Details
            </h1>
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Request ID: #{request.id}
            </p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Request
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
          <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Request Status</p>
          <span className={getStatusBadge(request.status, 'status')}>{request.status}</span>
        </div>
        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
          <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Payment Status</p>
          <span className={getStatusBadge(request.paymentStatus, 'payment')}>{request.paymentStatus}</span>
        </div>
      </div>

      {/* Batch & Route Information */}
      <div className={`rounded-xl mb-6 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Batch & Route Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                Shipping Batch
              </label>
              <div className="flex items-center gap-2">
                <Ship className={`w-5 h-5 ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                <p className={`text-lg font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.batchTitle}
                </p>
              </div>
              <p className={`text-sm mt-1 ml-7 ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                {request.routeName}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400' : 'text-blue-500'}`} />
                  <div>
                    <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>Departure</p>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{request.departure}</p>
                  </div>
                </div>
                <div className={`text-2xl ${isDarkTheme ? 'text-slate-600' : 'text-gray-400'}`}>→</div>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${isDarkTheme ? 'text-green-400' : 'text-green-500'}`} />
                  <div>
                    <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>Destination</p>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{request.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer & Cargo Details */}
      <div className={`rounded-xl mb-6 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Customer & Cargo Information
            </h2>
          </div>

          {/* Customer */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Customer Name
            </label>
            <div className="flex items-center gap-2">
              <User className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
              <p className={`text-lg font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {request.customerName}
              </p>
            </div>
          </div>

          {/* Pickup and Delivery Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                Pickup Location
              </label>
              <div className="flex items-center gap-2 mb-2">
                {request.pickupLocation === 'home' ? (
                  <Home className="w-5 h-5 text-orange-500" />
                ) : (
                  <Building2 className="w-5 h-5 text-orange-500" />
                )}
                <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.pickupLocation === 'home' ? 'From Home' : 'From Office'}
                </span>
              </div>
              {request.pickupAddress && (
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  {request.pickupAddress}
                </p>
              )}
              {!request.pickupAddress && (
                <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  Pickup from company office
                </p>
              )}
            </div>
            <div className={`p-4 rounded-xl border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                Delivery Location
              </label>
              <div className="flex items-center gap-2 mb-2">
                {request.deliveryLocation === 'home' ? (
                  <Home className="w-5 h-5 text-orange-500" />
                ) : (
                  <Building2 className="w-5 h-5 text-orange-500" />
                )}
                <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {request.deliveryLocation === 'home' ? 'To Home' : 'At Office'}
                </span>
              </div>
              {request.deliveryAddress && (
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  {request.deliveryAddress}
                </p>
              )}
              {!request.deliveryAddress && (
                <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  Delivery to company office
                </p>
              )}
            </div>
          </div>

          {/* Cargo Information */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Cargo Name
            </label>
            <div className="flex items-center gap-2 mb-4">
              <Package className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
              <p className={`text-lg font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {request.cargoName}
              </p>
            </div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Description
            </label>
            <p className={`${isDarkTheme ? 'text-slate-300' : 'text-gray-700'} leading-relaxed`}>
              {request.description}
            </p>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className={`rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                Created At
              </label>
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
                <p className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
                  {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                Last Updated
              </label>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
                <p className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
                  {new Date(request.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowRequestPage;