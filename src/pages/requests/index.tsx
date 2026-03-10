import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Package, Plus, Search, Eye, Trash2, CheckCircle, Truck, CreditCard,
  MapPin, Loader2, Hash,
} from 'lucide-react';
import { getAllShipments, deleteShipment, type Shipment } from '../api/api_services/shipment';
import { getAllBatches, type Batch } from '../api/api_services/batch';
import { getAllCustomers, type Customer } from '../api/api_services/customer'; // adjust path if needed
import CreateShipmentPage from './add';
import ShowShipmentPage from './show';

const ShipmentsPage: React.FC = () => {
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'show'>('list');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [shipmentsData, batchesData, customersData] = await Promise.all([
        getAllShipments(),
        getAllBatches(),
        getAllCustomers(),
      ]);
      setShipments(shipmentsData);
      setBatches(batchesData);
      setCustomers(customersData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    try {
      await deleteShipment(id);
      setShipments(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete shipment');
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      s.shipment_status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getShipmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':  return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'in transit': return isDarkTheme ? 'bg-blue-900/30 text-blue-400 border-blue-800'  : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':    return isDarkTheme ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':  return isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800'     : 'bg-red-100 text-red-700 border-red-200';
      default:           return isDarkTheme ? 'bg-slate-700 text-slate-300 border-slate-600'  : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':    return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800'    : 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return isDarkTheme ? 'bg-orange-900/30 text-orange-400 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'failed':  return isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800'          : 'bg-red-100 text-red-700 border-red-200';
      default:        return isDarkTheme ? 'bg-slate-700 text-slate-300 border-slate-600'       : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (view === 'add') {
    return (
      <CreateShipmentPage
        isDarkTheme={isDarkTheme}
        batches={batches}
        customers={customers}
        onSave={() => { fetchData(); setView('list'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'show' && selectedShipment) {
    return (
      <ShowShipmentPage
        isDarkTheme={isDarkTheme}
        shipment={selectedShipment}
        onClose={() => { setView('list'); setSelectedShipment(null); }}
        onRefresh={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
          <Package className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Shipments</h1>
          <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Track and manage all shipments</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by tracking #, customer, batch, route..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => setView('add')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Add Shipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Shipments', value: shipments.length, color: 'from-orange-500 to-orange-600', icon: Package },
          { label: 'Pending', value: shipments.filter(s => s.shipment_status === 'Pending').length, color: 'from-yellow-500 to-yellow-600', icon: Truck },
          { label: 'Delivered', value: shipments.filter(s => s.shipment_status === 'Delivered').length, color: 'from-green-500 to-green-600', icon: CheckCircle },
          { label: 'Paid', value: shipments.filter(s => s.payment_status === 'Paid').length, color: 'from-purple-500 to-purple-600', icon: CreditCard },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-6 shadow-lg flex items-center justify-between ${isDarkTheme ? 'bg-slate-800' : 'bg-white'}`}>
            <div>
              <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl overflow-hidden shadow-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                {['Tracking #', 'Customer', 'Route', 'Batch', 'Departure', 'Est. Arrival', 'Status', 'Payment', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'} ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <Loader2 className={`w-8 h-8 mx-auto animate-spin mb-3 ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                    <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>Loading shipments...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchData} className="mt-3 text-orange-500 hover:underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Package className={`w-12 h-12 mx-auto mb-4 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No shipments found</p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map(shipment => (
                  <tr key={shipment.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                    {/* Tracking # */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Hash className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-mono text-xs font-semibold ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`}>
                          {shipment.tracking_number}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {shipment.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{shipment.customer_name}</p>
                          <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>{shipment.customer_phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span>{shipment.origin}</span>
                        <span className="mx-1">→</span>
                        <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span>{shipment.destination}</span>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className={`px-6 py-4 font-mono text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      {shipment.batch_number}
                    </td>

                    {/* Departure */}
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {formatDate(shipment.departure_date)}
                    </td>

                    {/* Est. Arrival */}
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                      {formatDate(shipment.estimated_arrival_date)}
                    </td>

                    {/* Shipment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getShipmentStatusColor(shipment.shipment_status)}`}>
                        {shipment.shipment_status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(shipment.payment_status)}`}>
                        {shipment.payment_status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedShipment(shipment); setView('show'); }}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                          title="View"
                        ><Eye className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDelete(shipment.id)}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' : 'hover:bg-red-50 text-red-600 hover:text-red-700'}`}
                          title="Delete"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsPage;