import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Navigation, Plus, Search, Edit2, Trash2, MapPin, Clock, Loader2 } from 'lucide-react';
import AddRoute from './add';
import EditRoute from './edit';
import { getAllRoutes, deleteRoute, type Route } from '../api/api_services/routes';
import { getAllBranches, type Branch } from '../api/api_services/branch';

const RoutesPage: React.FC = () => {
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [routesData, branchesData] = await Promise.all([getAllRoutes(), getAllBranches()]);
      setRoutes(routesData);
      setBranches(branchesData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load routes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      await deleteRoute(id);
      setRoutes(routes.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete route');
    }
  };

  const filteredRoutes = routes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.origin_branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination_branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remaining = hours % 24;
    return remaining > 0 ? `${days}d ${remaining}h` : `${days}d`;
  };

  if (view === 'add') {
    return (
      <AddRoute
        isDarkTheme={isDarkTheme}
        branches={branches}
        onSave={() => { fetchData(); setView('list'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedRoute) {
    return (
      <EditRoute
        isDarkTheme={isDarkTheme}
        branches={branches}
        route={selectedRoute}
        onSave={() => { fetchData(); setView('list'); setSelectedRoute(null); }}
        onCancel={() => { setView('list'); setSelectedRoute(null); }}
      />
    );
  }

  return (
    <div className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Route Management
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage shipping routes and connections
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by name, origin or destination..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <button
          onClick={() => setView('add')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Route
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Routes', value: routes.length, color: 'from-orange-500 to-orange-400', icon: Navigation },
          { label: 'Branches Connected', value: new Set([...routes.map(r => r.origin_branch), ...routes.map(r => r.destination_branch)]).size, color: 'from-blue-500 to-blue-400', icon: MapPin },
          {
            label: 'Avg. Duration',
            value: routes.length ? `${Math.round(routes.reduce((sum, r) => sum + r.estimated_duration_hours, 0) / routes.length)}h` : '—',
            color: 'from-green-500 to-green-400',
            icon: Clock,
          },
        ].map(stat => (
          <div key={stat.label} className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                {['Route Name', 'Origin', 'Destination', 'Est. Duration', 'Actions'].map(h => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'} ${h === 'Actions' ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className={`w-8 h-8 mx-auto animate-spin mb-3 ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                    <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>Loading routes...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchData} className="mt-3 text-orange-500 hover:underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Navigation className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No routes found</p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your search or add a new route</p>
                  </td>
                </tr>
              ) : (
                filteredRoutes.map(route => (
                  <tr key={route.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{route.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        {route.origin_branch}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {route.destination_branch}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        {formatDuration(route.estimated_duration_hours)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedRoute(route); setView('edit'); }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-slate-600 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default RoutesPage;