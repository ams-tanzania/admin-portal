import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Ship, Plus, Search, Edit2, Trash2, Eye, Calendar, MapPin, Package, Loader2 } from 'lucide-react';
import AddShippingSchedule from './add';
import EditShippingSchedule from './edit';
import ShowShippingSchedule from './show';
import { getAllBatches, deleteBatch, type Batch } from '../api/api_services/batch';
import { getAllRoutes, type Route } from '../api/api_services/routes';

const ShippingSchedulePage: React.FC = () => {
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit' | 'show'>('list');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [batchesData, routesData] = await Promise.all([getAllBatches(), getAllRoutes()]);
      setBatches(batchesData);
      setRoutes(routesData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      await deleteBatch(id);
      setBatches(batches.filter(b => b.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete batch');
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch =
      b.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.origin_branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination_branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full':        return isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200';
      case 'almost_full': return isDarkTheme ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'empty':
      case 'available':   return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'completed':   return isDarkTheme ? 'bg-gray-900/30 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200';
      default:            return isDarkTheme ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (view === 'add') {
    return (
      <AddShippingSchedule
        isDarkTheme={isDarkTheme}
        routes={routes}
        onSave={() => { fetchData(); setView('list'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedBatch) {
    return (
      <EditShippingSchedule
        isDarkTheme={isDarkTheme}
        routes={routes}
        batch={selectedBatch}
        onSave={() => { fetchData(); setView('list'); setSelectedBatch(null); }}
        onCancel={() => { setView('list'); setSelectedBatch(null); }}
      />
    );
  }

  if (view === 'show' && selectedBatch) {
    return (
      <ShowShippingSchedule
        isDarkTheme={isDarkTheme}
        batch={selectedBatch}
        onEdit={() => setView('edit')}
        onClose={() => { setView('list'); setSelectedBatch(null); }}
        onRefresh={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Ship className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Shipping Schedule Management
            </h1>
            <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>
              Manage batches and track shipments
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by batch number, route, branch..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Statuses</option>
          <option value="empty">Empty</option>
          <option value="available">Available</option>
          <option value="almost_full">Almost Full</option>
          <option value="full">Full</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={() => setView('add')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Batch
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Batches', value: batches.length, color: 'from-orange-500 to-orange-600', icon: Package },
          { label: 'Active', value: batches.filter(b => !['completed'].includes(b.status)).length, color: 'from-blue-500 to-blue-600', icon: Ship },
          { label: 'Available', value: batches.filter(b => b.status === 'empty' || b.status === 'available').length, color: 'from-green-500 to-green-600', icon: Calendar },
          { label: 'Completed', value: batches.filter(b => b.status === 'completed').length, color: 'from-purple-500 to-purple-600', icon: MapPin },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-6 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-between`}>
            <div>
              <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</div>
              <div className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl overflow-hidden ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                {['Batch Number', 'Route', 'Origin → Destination', 'Departure', 'Est. Arrival', 'Capacity', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'} ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <Loader2 className={`w-8 h-8 mx-auto animate-spin mb-3 ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                    <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>Loading batches...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchData} className="mt-3 text-orange-500 hover:underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Ship className={`w-12 h-12 mx-auto mb-4 ${isDarkTheme ? 'text-slate-600' : 'text-gray-400'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No batches found</p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your filters or add a new batch</p>
                  </td>
                </tr>
              ) : (
                filteredBatches.map(batch => (
                  <tr key={batch.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Ship className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-mono text-sm font-medium">{batch.batch_number}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {batch.route}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span>{batch.origin_branch}</span>
                        <span className="mx-1">→</span>
                        <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span>{batch.destination_branch}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(batch.departure_date)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                      {formatDate(batch.estimated_arrival_date)}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {parseFloat(batch.capacity_in_cbm).toLocaleString()} CBM
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(batch.status)}`}>
                        {formatStatus(batch.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedBatch(batch); setView('show'); }}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                          title="View"
                        ><Eye className="w-4 h-4" /></button>
                        <button
                          onClick={() => { setSelectedBatch(batch); setView('edit'); }}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                          title="Edit"
                        ><Edit2 className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDelete(batch.id)}
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

export default ShippingSchedulePage;