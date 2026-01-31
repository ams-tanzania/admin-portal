import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Ship, Plus, Search, Edit2, Trash2, Eye, Calendar, MapPin, Package } from 'lucide-react';
import AddShippingSchedule from './add';
import EditShippingSchedule from './edit';
import ShowShippingSchedule from './show';

// Types
interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
}

interface TransitUpdate {
  id: string;
  date: string;
  location: string;
  description: string;
  createdAt: string;
}



export interface ShippingSchedule {
  id: string;
  scheduleTitle: string;
  routeId: string;
  startingDate: string;
  estimatedArrivalDate: string;
  status: 'Full' | 'Almost Full' | 'Available' | 'Completed/Closed';
  shippingStatus: 'Warehouse' | 'Loaded' | 'In Transit' | 'Arrived';
  transitUpdates: TransitUpdate[];
  createdAt: string;
}

// Shipping Request Type (imported from your requests module)
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

// Main Shipping Schedule Component
const ShippingSchedulePage: React.FC = () => {
  // Get theme from outlet context
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit' | 'show'>('list');

  // Sample routes data (in real app, this would come from your routes state/API)
  const [routes] = useState<Route[]>([
    { id: '1', routeName: 'DSM-ZNZ Express', departure: 'Dar es Salaam Port', destination: 'Zanzibar Harbor' },
    { id: '2', routeName: 'East African Coastal', departure: 'Dar es Salaam Port', destination: 'Mombasa Port' },
    { id: '3', routeName: 'Zanzibar-Mombasa Link', departure: 'Zanzibar Harbor', destination: 'Mombasa Port' }
  ]);

  const [schedules, setSchedules] = useState<ShippingSchedule[]>([
    {
      id: '1',
      scheduleTitle: 'January Express Shipment',
      routeId: '1',
      startingDate: '2024-01-15',
      estimatedArrivalDate: '2024-01-17',
      status: 'Available',
      shippingStatus: 'Warehouse',
      transitUpdates: [],
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      scheduleTitle: 'Coastal Cargo Run',
      routeId: '2',
      startingDate: '2024-01-20',
      estimatedArrivalDate: '2024-01-25',
      status: 'Almost Full',
      shippingStatus: 'In Transit',
      transitUpdates: [
        {
          id: '1',
          date: '2024-01-21',
          location: 'Tanga Port',
          description: 'Passed through Tanga, on schedule',
          createdAt: '2024-01-21T10:30:00'
        },
        {
          id: '2',
          date: '2024-01-22',
          location: 'Pemba Channel',
          description: 'Crossing Pemba Channel, weather conditions good',
          createdAt: '2024-01-22T08:15:00'
        }
      ],
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      scheduleTitle: 'Island Connection February',
      routeId: '3',
      startingDate: '2024-02-01',
      estimatedArrivalDate: '2024-02-03',
      status: 'Full',
      shippingStatus: 'Loaded',
      transitUpdates: [],
      createdAt: '2024-01-25'
    }
  ]);

  // Sample shipping requests data
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
      batchId: '2',
      batchTitle: 'Coastal Cargo Run',
      routeName: 'East African Coastal',
      departure: 'Dar es Salaam Port',
      destination: 'Mombasa Port',
      customerName: 'Michael Brown',
      pickupLocation: 'home',
      pickupAddress: 'Masaki, Dar es Salaam',
      deliveryLocation: 'office',
      cargoName: 'Machinery Parts',
      description: 'Industrial equipment components',
      status: 'Accepted',
      paymentStatus: 'Paid',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-19'
    },
    {
      id: '4',
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
    },
    {
      id: '5',
      batchId: '1',
      batchTitle: 'January Express Shipment',
      routeName: 'DSM-ZNZ Express',
      departure: 'Dar es Salaam Port',
      destination: 'Zanzibar Harbor',
      customerName: 'David Johnson',
      pickupLocation: 'office',
      deliveryLocation: 'home',
      deliveryAddress: 'Nungwi Beach, Zanzibar',
      cargoName: 'Food Products',
      description: 'Packaged spices and condiments',
      status: 'Accepted',
      paymentStatus: 'Unpaid',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16'
    }
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState<ShippingSchedule | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ShippingRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterShippingStatus, setFilterShippingStatus] = useState<string>('all');

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.routeName : 'Unknown Route';
  };

  const handleAddSchedule = (schedule: Omit<ShippingSchedule, 'id' | 'createdAt'>) => {
    const newSchedule: ShippingSchedule = {
      ...schedule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSchedules([...schedules, newSchedule]);
    setView('list');
  };

  const handleEditSchedule = (schedule: ShippingSchedule) => {
    setSchedules(schedules.map(s => s.id === schedule.id ? schedule : s));
    setView('list');
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this shipping schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  // Request handlers
  const handleViewRequest = (request: ShippingRequest) => {
    setSelectedRequest(request);
    // You can navigate to request details page or show in modal
    console.log('View request:', request);
  };

  const handleEditRequest = (request: ShippingRequest) => {
    setSelectedRequest(request);
    // You can navigate to request edit page or show in modal
    console.log('Edit request:', request);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this shipping request?')) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };
  const handleUpdateStatus = (scheduleId: string, status: string) => {
  setSchedules(prevSchedules => 
    prevSchedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: status as ShippingSchedule['status'] } 
        : schedule
    )
  );
  
  // Also update the selectedSchedule if it's the one being updated
  if (selectedSchedule && selectedSchedule.id === scheduleId) {
    setSelectedSchedule({
      ...selectedSchedule,
      status: status as ShippingSchedule['status']
    });
  }
};

const handleUpdateShippingStatus = (scheduleId: string, shippingStatus: string) => {
  setSchedules(prevSchedules => 
    prevSchedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, shippingStatus: shippingStatus as ShippingSchedule['shippingStatus'] } 
        : schedule
    )
  );
  
  // Also update the selectedSchedule if it's the one being updated
  if (selectedSchedule && selectedSchedule.id === scheduleId) {
    setSelectedSchedule({
      ...selectedSchedule,
      shippingStatus: shippingStatus as ShippingSchedule['shippingStatus']
    });
  }
};
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Full':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Almost Full':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Available':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Completed/Closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getShippingStatusColor = (shippingStatus: string) => {
    switch (shippingStatus) {
      case 'Warehouse':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Loaded':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'In Transit':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Arrived':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.scheduleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getRouteName(schedule.routeId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    const matchesShippingStatus = filterShippingStatus === 'all' || schedule.shippingStatus === filterShippingStatus;
    
    return matchesSearch && matchesStatus && matchesShippingStatus;
  });

  if (view === 'add') {
    return <AddShippingSchedule 
      isDarkTheme={isDarkTheme} 
      routes={routes}
      onSave={handleAddSchedule}
      onCancel={() => setView('list')}
    />;
  }

  if (view === 'edit' && selectedSchedule) {
    return <EditShippingSchedule 
      isDarkTheme={isDarkTheme}
      routes={routes}
      schedule={selectedSchedule}
      onSave={handleEditSchedule}
      onCancel={() => {
        setView('list');
        setSelectedSchedule(null);
      }}
    />;
  }

  if (view === 'show' && selectedSchedule) {
    return <ShowShippingSchedule 
      isDarkTheme={isDarkTheme}
      schedule={selectedSchedule}
      route={routes.find(r => r.id === selectedSchedule.routeId)!}
      requests={requests}
      onEdit={() => setView('edit')}
      onClose={() => {
        setView('list');
        setSelectedSchedule(null);
      }}
      onViewRequest={handleViewRequest}
      onEditRequest={handleEditRequest}
      onDeleteRequest={handleDeleteRequest}
      onUpdateStatus={handleUpdateStatus}              // LINES FOR UPDATE STATUS
      onUpdateShippingStatus={handleUpdateShippingStatus}  // LINES FOR UPDATE STATUS
    />;
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
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Manage batches and track shipments
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDarkTheme ? 'text-slate-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme 
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme 
              ? 'bg-slate-800 border-slate-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="Available">Available</option>
          <option value="Almost Full">Almost Full</option>
          <option value="Full">Full</option>
          <option value="Completed/Closed">Completed/Closed</option>
        </select>

        <select
          value={filterShippingStatus}
          onChange={(e) => setFilterShippingStatus(e.target.value)}
          className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkTheme 
              ? 'bg-slate-800 border-slate-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Shipping Status</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Loaded">Loaded</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived">Arrived</option>
        </select>

        <button
          onClick={() => setView('add')}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Schedules */}
        <div className={`rounded-xl p-6 ${
          isDarkTheme ? 'bg-slate-800' : 'bg-white'
        } shadow-lg flex items-center justify-between`}>
          <div>
            <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Total Schedules
            </div>
            <div className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {schedules.length}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* In Transit */}
        <div className={`rounded-xl p-6 ${
          isDarkTheme ? 'bg-slate-800' : 'bg-white'
        } shadow-lg flex items-center justify-between`}>
          <div>
            <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              In Transit
            </div>
            <div className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {schedules.filter(s => s.shippingStatus === 'In Transit').length}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Ship className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Available */}
        <div className={`rounded-xl p-6 ${
          isDarkTheme ? 'bg-slate-800' : 'bg-white'
        } shadow-lg flex items-center justify-between`}>
          <div>
            <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Available
            </div>
            <div className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {schedules.filter(s => s.status === 'Available').length}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Completed */}
        <div className={`rounded-xl p-6 ${
          isDarkTheme ? 'bg-slate-800' : 'bg-white'
        } shadow-lg flex items-center justify-between`}>
          <div>
            <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Completed
            </div>
            <div className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {schedules.filter(s => s.status === 'Completed/Closed').length}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className={`rounded-xl overflow-hidden ${
        isDarkTheme ? 'bg-slate-800' : 'bg-white'
      } shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Schedule Title
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Route
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Dates
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Shipping Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Ship className={`w-12 h-12 mx-auto mb-4 ${isDarkTheme ? 'text-slate-600' : 'text-gray-400'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      No schedules found
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                      Try adjusting your filters or add a new schedule
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className={`hover:${isDarkTheme ? 'bg-slate-700/50' : 'bg-gray-50'} transition-colors`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="font-medium">{schedule.scheduleTitle}</div>
                      <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                        {requests.filter(r => r.batchId === schedule.id).length} request(s)
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      {getRouteName(schedule.routeId)}
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(schedule.startingDate).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                        ETA: {new Date(schedule.estimatedArrivalDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getShippingStatusColor(schedule.shippingStatus)}`}>
                        {schedule.shippingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setView('show');
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme 
                              ? 'hover:bg-slate-600 text-slate-300 hover:text-white' 
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
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
                          onClick={() => handleDeleteSchedule(schedule.id)}
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

export default ShippingSchedulePage;