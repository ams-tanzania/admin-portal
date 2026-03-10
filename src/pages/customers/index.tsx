import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Plus, Search, Edit2, Trash2, Eye, Mail, Phone, MapPin, Building2, Loader2 } from 'lucide-react';
import AddCustomer from './add';
import EditCustomer from './edit';
import ShowCustomer from './show';
import { getAllCustomers, deleteCustomer, type Customer } from '../api/api_services/customer';

const CustomersPage: React.FC = () => {
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit' | 'show'>('list');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'from-orange-500 to-orange-400',
    'from-blue-500 to-blue-400',
    'from-green-500 to-green-400',
    'from-purple-500 to-purple-400',
    'from-pink-500 to-pink-400',
    'from-indigo-500 to-indigo-400',
  ];
  const getAvatarColor = (id: string) =>
    avatarColors[id.charCodeAt(0) % avatarColors.length];

  const getStatusBadge = (status: string) =>
    status === 'active'
      ? isDarkTheme
        ? 'bg-green-900/30 text-green-400 border-green-800'
        : 'bg-green-100 text-green-700 border-green-200'
      : isDarkTheme
      ? 'bg-red-900/30 text-red-400 border-red-800'
      : 'bg-red-100 text-red-700 border-red-200';

  if (view === 'add') {
    return (
      <AddCustomer
        isDarkTheme={isDarkTheme}
        onSave={() => { fetchCustomers(); setView('list'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedCustomer) {
    return (
      <EditCustomer
        isDarkTheme={isDarkTheme}
        customer={selectedCustomer}
        onSave={() => { fetchCustomers(); setView('list'); setSelectedCustomer(null); }}
        onCancel={() => { setView('list'); setSelectedCustomer(null); }}
      />
    );
  }

  if (view === 'show' && selectedCustomer) {
    return (
      <ShowCustomer
        isDarkTheme={isDarkTheme}
        customer={selectedCustomer}
        onBack={() => { setView('list'); setSelectedCustomer(null); }}
        onEdit={() => setView('edit')}
      />
    );
  }

  return (
    <div className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Customers
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage registered customers
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <button
          onClick={() => setView('add')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, color: 'from-orange-500 to-orange-400' },
          { label: 'Active', value: customers.filter(c => c.status === 'active').length, color: 'from-green-500 to-green-400' },
          { label: 'Inactive', value: customers.filter(c => c.status !== 'active').length, color: 'from-red-500 to-red-400' },
        ].map(stat => (
          <div key={stat.label} className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <Users className="w-6 h-6 text-white" />
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
                {['Customer', 'Contact', 'Location', 'Company', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'} ${h === 'Actions' ? 'text-right' : ''}`}>
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
                    <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'}>Loading customers...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchCustomers} className="mt-3 text-orange-500 hover:underline text-sm">Retry</button>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>No customers found</p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your search or add a new customer</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(customer.id)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                          {getInitials(customer.full_name)}
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{customer.full_name}</div>
                          <div className={`text-sm flex items-center gap-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                            <Mail className="w-3 h-3" />{customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />{customer.phone}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />{customer.city}, {customer.country}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {customer.company_name || <span className={isDarkTheme ? 'text-slate-500' : 'text-gray-400'}>—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusBadge(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedCustomer(customer); setView('show'); }}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                          title="View"
                        ><Eye className="w-4 h-4" /></button>
                        <button
                          onClick={() => { setSelectedCustomer(customer); setView('edit'); }}
                          className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                          title="Edit"
                        ><Edit2 className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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

export default CustomersPage;