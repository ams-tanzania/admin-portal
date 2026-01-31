import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, Plus, Search, Edit2, Trash2, Eye, CheckCircle, Truck, CreditCard, User } from 'lucide-react';
import CreateRequestPage from './add';
import ShowRequestPage from './show';
import EditRequestPage from './edit';

// Types
export interface ShippingSchedule {
  id: string;
  scheduleTitle: string;
  routeId: string;
  routeName: string;
  departure: string;
  destination: string;
}

export interface ShippingRequest {
  id: string;
  batchId: string;
  batchTitle: string;
  routeName: string;
  departure: string;
  destination: string;
  customerName: string;
  pickupLocation: 'home' | 'office';
  pickupAddress?: string;
  deliveryLocation: 'home' | 'office';
  deliveryAddress?: string;
  cargoName: string;
  description: string;
  status: 'Accepted' | 'Rejected';
  paymentStatus: 'Paid' | 'Unpaid';
  createdAt: string;
  updatedAt: string;
}

const ShippingRequestsSystem: React.FC = () => {
  // Get theme from outlet context (controlled globally from navbar)
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'create' | 'show' | 'edit'>('list');
  const [selectedRequest, setSelectedRequest] = useState<ShippingRequest | null>(null);

  // Sample shipping schedules (batches)
  const [schedules] = useState<ShippingSchedule[]>([
    {
      id: '1',
      scheduleTitle: 'January Express Shipment',
      routeId: '1',
      routeName: 'DSM-ZNZ Express',
      departure: 'Dar es Salaam Port',
      destination: 'Zanzibar Harbor'
    },
    {
      id: '2',
      scheduleTitle: 'Coastal Cargo Run',
      routeId: '2',
      routeName: 'East African Coastal',
      departure: 'Dar es Salaam Port',
      destination: 'Mombasa Port'
    },
    {
      id: '3',
      scheduleTitle: 'Island Connection February',
      routeId: '3',
      routeName: 'Zanzibar-Mombasa Link',
      departure: 'Zanzibar Harbor',
      destination: 'Mombasa Port'
    }
  ]);

  const [requests, setRequests] = useState<ShippingRequest[]>([
    {
      id: '1',
      batchId: '1',
      batchTitle: 'January Express Shipment',
      routeName: 'DSM-ZNZ Express',
      departure: 'Dar es Salaam Port',
      destination: 'Zanzibar Harbor',
      customerName: 'John Doe',
      pickupLocation: 'home',
      pickupAddress: 'Kariakoo, Dar es Salaam',
      deliveryLocation: 'office',
      cargoName: 'Electronics',
      description: 'Laptop computers and accessories',
      status: 'Accepted',
      paymentStatus: 'Paid',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: '2',
      batchId: '2',
      batchTitle: 'Coastal Cargo Run',
      routeName: 'East African Coastal',
      departure: 'Dar es Salaam Port',
      destination: 'Mombasa Port',
      customerName: 'Sarah Admin',
      pickupLocation: 'office',
      deliveryLocation: 'home',
      deliveryAddress: 'Stone Town, Zanzibar',
      cargoName: 'Textiles',
      description: 'Cotton fabrics and garments',
      status: 'Accepted',
      paymentStatus: 'Unpaid',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      batchId: '3',
      batchTitle: 'Island Connection February',
      routeName: 'Zanzibar-Mombasa Link',
      departure: 'Zanzibar Harbor',
      destination: 'Mombasa Port',
      customerName: 'Alice Smith',
      pickupLocation: 'home',
      pickupAddress: 'Mwanza City Center',
      deliveryLocation: 'home',
      deliveryAddress: 'Arusha National Park Area',
      cargoName: 'Furniture',
      description: 'Wooden dining table and chairs',
      status: 'Rejected',
      paymentStatus: 'Unpaid',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createdRequest, setCreatedRequest] = useState<ShippingRequest | null>(null);

  const handleCreateRequest = (request: Omit<ShippingRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: ShippingRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setRequests([...requests, newRequest]);
    setView('list');
    return newRequest;
  };

  const handleEditRequest = (request: ShippingRequest) => {
    setRequests(requests.map(r => r.id === request.id ? { ...request, updatedAt: new Date().toISOString().split('T')[0] } : r));
    setView('list');
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this shipping request?')) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  if (view === 'create') {
    return <CreateRequestPage isDarkTheme={isDarkTheme} schedules={schedules} onSave={handleCreateRequest} onCancel={() => setView('list')} />;
  }

  if (view === 'show' && selectedRequest) {
    return <ShowRequestPage isDarkTheme={isDarkTheme} request={selectedRequest} onEdit={() => setView('edit')} onBack={() => { setView('list'); setSelectedRequest(null); }} />;
  }

  if (view === 'edit' && selectedRequest) {
    return <EditRequestPage isDarkTheme={isDarkTheme} request={selectedRequest} onSave={handleEditRequest} onCancel={() => { setView('list'); setSelectedRequest(null); }} />;
  }

  

  // Only show filtered requests when there's a search term or filter applied
  const hasActiveFilter = searchTerm.trim() !== '' || statusFilter !== 'all';
  
  const filteredRequests = hasActiveFilter ? requests.filter(request => {
    const matchesSearch = searchTerm.trim() === '' || 
      request.cargoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.batchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.routeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status: string, type: 'status' | 'payment') => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    
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
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Shipping Requests
            </h1>
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Manage all shipping requests and track their status
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by cargo, batch, customer, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={() => setView('create')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Create Request
        </button>
      </div>

      {/* Stats Cards - Show overall statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Total Requests</p>
            <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{requests.length}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Accepted</p>
            <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {requests.filter(r => r.status === 'Accepted').length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Rejected</p>
            <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {requests.filter(r => r.status === 'Rejected').length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-between`}>
          <div>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Paid</p>
            <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {requests.filter(r => r.paymentStatus === 'Paid').length}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className={`rounded-xl overflow-hidden ${isDarkTheme ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Cargo</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Customer</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Batch / Route</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Payment</th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {!hasActiveFilter ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Search className={`w-16 h-16 mx-auto mb-4 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-xl font-semibold mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      Start searching for requests
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                      Use the search bar or filters above to find shipping requests
                    </p>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      No requests found
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{request.cargoName}</p>
                          <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                            {request.description.length > 30 ? request.description.substring(0, 30) + '...' : request.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.customerName}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>
                        <p className="font-medium text-sm">{request.batchTitle}</p>
                        <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                          {request.departure} → {request.destination}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(request.status, 'status')}>{request.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(request.paymentStatus, 'payment')}>{request.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedRequest(request); setView('show'); }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedRequest(request); setView('edit'); }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'
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

export default ShippingRequestsSystem;