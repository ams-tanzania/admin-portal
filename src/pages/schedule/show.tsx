import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Edit2, Calendar, MapPin, Ship, Package, Clock, Hash,
  Users, Mail, Phone, ExternalLink, Loader2,
} from 'lucide-react';
import { type Batch, type Shipment, getBatchById } from '../api/api_services/batch';

const ShowShippingSchedule: React.FC<{
  isDarkTheme: boolean;
  batch: Batch;
  onEdit: () => void;
  onClose: () => void;
  onRefresh: () => void;
}> = ({ isDarkTheme, batch: initialBatch, onEdit, onClose }) => {
  const [batch, setBatch] = useState<Batch>(initialBatch);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipmentSearch, setShipmentSearch] = useState('');

  useEffect(() => {
    const fetchBatchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getBatchById(initialBatch.id);
        setBatch(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load batch details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBatchDetails();
  }, [initialBatch.id]);

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      : '—';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full':        return 'bg-red-500 text-white';
      case 'almost_full': return 'bg-yellow-500 text-white';
      case 'empty':
      case 'available':   return 'bg-green-500 text-white';
      case 'completed':   return 'bg-gray-500 text-white';
      default:            return 'bg-slate-500 text-white';
    }
  };

  const getShipmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':  return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'in transit': return isDarkTheme ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':    return isDarkTheme ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':  return isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200';
      default:           return isDarkTheme ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':    return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return isDarkTheme ? 'bg-orange-900/30 text-orange-400 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'failed':  return isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200';
      default:        return isDarkTheme ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const calculateDays = () => {
    const start = new Date(batch.departure_date);
    const end = new Date(batch.estimated_arrival_date);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredShipments = (batch.shipments ?? []).filter(s =>
    s.tracking_number.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
    s.customer_email.toLowerCase().includes(shipmentSearch.toLowerCase())
  );

  const card = `rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`;
  const label = `text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`;
  const value = `text-base font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schedules
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Batch Details</h1>
            <p className={`font-mono text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>{batch.batch_number}</p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className={card}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{batch.route}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(batch.status)}`}>
                  {formatStatus(batch.status)}
                </span>
              </div>
            </div>

            {/* Route Visualization */}
            <div className={`p-5 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Origin</span>
                  </div>
                  <p className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{batch.origin_branch}</p>
                </div>
                <div className="px-4 text-2xl text-slate-400">→</div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Destination</span>
                    <MapPin className="w-4 h-4 text-green-400" />
                  </div>
                  <p className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{batch.destination_branch}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={card}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="w-5 h-5" /> Schedule Dates
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Departure', value: formatDate(batch.departure_date), color: 'from-blue-500 to-blue-400' },
                { label: 'Est. Arrival', value: formatDate(batch.estimated_arrival_date), color: 'from-green-500 to-green-400' },
                { label: 'Actual Departure', value: formatDate(batch.actual_departure_at), color: 'from-purple-500 to-purple-400' },
                { label: 'Actual Arrival', value: formatDate(batch.actual_arrival_at), color: 'from-teal-500 to-teal-400' },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <p className={label}>{item.label}</p>
                  <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipments Table */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                <Package className="w-5 h-5 text-orange-400" />
                Shipments
                {!isLoading && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                    {batch.shipments?.length ?? 0}
                  </span>
                )}
              </h3>
              {/* Search shipments */}
              {!isLoading && (batch.shipments?.length ?? 0) > 0 && (
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={shipmentSearch}
                  onChange={e => setShipmentSearch(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkTheme ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              )}
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className={`w-8 h-8 animate-spin ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Loading shipments...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : (batch.shipments?.length ?? 0) === 0 ? (
              <div className="py-12 text-center">
                <Package className={`w-10 h-10 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                <p className={`font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No shipments in this batch</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                      {['Tracking #', 'Customer', 'Contact', 'Description', 'Shipment Status', 'Payment'].map(h => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-100'}`}>
                    {filteredShipments.map(shipment => (
                      <tr key={shipment.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50'}`}>
                        {/* Tracking Number */}
                        <td className="px-4 py-3">
                          <span className={`font-mono text-xs font-semibold ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`}>
                            {shipment.tracking_number}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-br from-orange-400 to-orange-500 text-white`}>
                              {shipment.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                              {shipment.customer_name}
                            </span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className={`space-y-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3" />
                              <span>{shipment.customer_email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3" />
                              <span>{shipment.customer_phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className={`px-4 py-3 text-xs max-w-[120px] truncate ${isDarkTheme ? 'text-slate-300' : 'text-gray-600'}`}>
                          {shipment.description}
                        </td>

                        {/* Shipment Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getShipmentStatusColor(shipment.shipment_status)}`}>
                            {shipment.shipment_status}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(shipment.payment_status)}`}>
                            {shipment.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredShipments.length === 0 && shipmentSearch && (
                  <div className="py-8 text-center">
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No shipments match your search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right – Quick Stats */}
        <div className="space-y-6">
          <div className={card}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Quick Info</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <p className={label}>Batch Number</p>
                </div>
                <p className={`font-mono text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{batch.batch_number}</p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-blue-400" />
                  <p className={label}>Capacity</p>
                </div>
                <p className={value}>{parseFloat(batch.capacity_in_cbm).toLocaleString()} CBM</p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-green-400" />
                  <p className={label}>Journey Duration</p>
                </div>
                <p className={value}>{calculateDays()} Days</p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  <p className={label}>Total Shipments</p>
                </div>
                <p className={value}>{isLoading ? '...' : (batch.shipments?.length ?? 0)}</p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={label}>Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batch.status)}`}>
                  {formatStatus(batch.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={card}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Actions</h3>
            <div className="space-y-3">
              <button
                onClick={onEdit}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Edit2 className="w-4 h-4" /> Edit Batch
              </button>
              <button
                onClick={onClose}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowShippingSchedule;