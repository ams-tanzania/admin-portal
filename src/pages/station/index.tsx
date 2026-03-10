import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Plus, Search, Edit2, Trash2, Globe, Building2, Loader2 } from 'lucide-react';
import AddStation from './add';
import EditStation from './edit';
import { getAllBranches, deleteBranch, type Branch } from '../api/api_services/branch';

const StationsPage: React.FC = () => {
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllBranches();
      setBranches(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this station?')) return;
    try {
      await deleteBranch(id);
      setBranches(branches.filter(b => b.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete station');
    }
  };

  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  if (view === 'add') {
    return (
      <AddStation
        isDarkTheme={isDarkTheme}
        onSave={() => { fetchBranches(); setView('list'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  // if (view === 'edit' && selectedBranch) {
  //   return (
  //     <EditStation
  //       isDarkTheme={isDarkTheme}
  //       station={selectedBranch}
  //       onSave={() => { fetchBranches(); setView('list'); setSelectedBranch(null); }}
  //       onCancel={() => { setView('list'); setSelectedBranch(null); }}
  //     />
  //   );
  // }

  return (
    <div className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Station Management
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage shipping stations and ports
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by name, city, country, phone..."
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
          Add Station
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Stations', value: branches.length, color: 'from-orange-500 to-orange-400', icon: MapPin },
          { label: 'Countries', value: new Set(branches.map(b => b.country)).size, color: 'from-blue-500 to-blue-400', icon: Globe },
          { label: 'Cities', value: new Set(branches.map(b => b.city)).size, color: 'from-green-500 to-green-400', icon: Building2 },
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
                {['Station Name', 'Address', 'City', 'Country', 'Phone', 'Actions'].map(h => (
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
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Loader2 className={`w-8 h-8 mx-auto animate-spin mb-3 ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
                    <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>Loading stations...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchBranches} className="mt-3 text-orange-500 hover:underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <MapPin className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No stations found</p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your search or add a new station</p>
                  </td>
                </tr>
              ) : (
                filteredBranches.map(branch => (
                  <tr key={branch.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{branch.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {branch.address}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {branch.city}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {branch.country}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {branch.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedBranch(branch); setView('edit'); }}
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
                          onClick={() => handleDelete(branch.id)}
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

export default StationsPage;