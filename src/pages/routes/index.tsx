import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Route as RouteIcon, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import AddRoute from './add';
import EditRoute from './edit';

// Types
interface Station {
  id: string;
  stationName: string;
  city: string;
  country: string;
}

interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
  createdAt: string;
}

// Main Routes Component
const RoutesPage: React.FC = () => {
  // Get theme from outlet context
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  
  // Sample stations data (in real app, this would come from your stations state/API)
  const [stations] = useState<Station[]>([
    {
      id: '1',
      stationName: 'Dar es Salaam Port',
      city: 'Dar es Salaam',
      country: 'Tanzania'
    },
    {
      id: '2',
      stationName: 'Zanzibar Harbor',
      city: 'Zanzibar',
      country: 'Tanzania'
    },
    {
      id: '3',
      stationName: 'Mombasa Port',
      city: 'Mombasa',
      country: 'Kenya'
    }
  ]);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      routeName: 'DSM-ZNZ Express',
      departure: '1',
      destination: '2',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      routeName: 'East African Coastal',
      departure: '1',
      destination: '3',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      routeName: 'Zanzibar-Mombasa Link',
      departure: '2',
      destination: '3',
      createdAt: '2024-02-01'
    }
  ]);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStationName = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.stationName : 'Unknown';
  };

  const handleAddRoute = (route: Omit<Route, 'id' | 'createdAt'>) => {
    // Check for duplicate route name
    if (routes.some(r => r.routeName.toLowerCase() === route.routeName.toLowerCase())) {
      alert('Route name must be unique!');
      return;
    }

    const newRoute: Route = {
      ...route,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoutes([...routes, newRoute]);
    setView('list');
  };

  const handleEditRoute = (route: Route) => {
    // Check for duplicate route name (excluding current route)
    if (routes.some(r => r.id !== route.id && r.routeName.toLowerCase() === route.routeName.toLowerCase())) {
      alert('Route name must be unique!');
      return;
    }

    setRoutes(routes.map(r => r.id === route.id ? route : r));
    setView('list');
    setSelectedRoute(null);
  };

  const handleDeleteRoute = (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(r => r.id !== id));
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStationName(route.departure).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStationName(route.destination).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'add') {
    return <AddRoute isDarkTheme={isDarkTheme} stations={stations} routes={routes} onSave={handleAddRoute} onCancel={() => setView('list')} />;
  }

  if (view === 'edit' && selectedRoute) {
    return <EditRoute isDarkTheme={isDarkTheme} stations={stations} routes={routes} route={selectedRoute} onSave={handleEditRoute} onCancel={() => { setView('list'); setSelectedRoute(null); }} />;
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
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Total Routes</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{routes.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
              <RouteIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Active Stations</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {stations.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
              <RouteIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Connections</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {new Set([...routes.map(r => r.departure), ...routes.map(r => r.destination)]).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <RouteIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Route Name
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Departure
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Destination
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Created
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <RouteIcon className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      No routes found
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                      Try adjusting your search or add a new route
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((route) => (
                  <tr key={route.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center">
                          <RouteIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{route.routeName}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {getStationName(route.departure)}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {getStationName(route.destination)}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                      {new Date(route.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRoute(route);
                            setView('edit');
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-slate-600 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
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