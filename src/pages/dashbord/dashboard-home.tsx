import React from 'react';
import { Calendar, Package, TrendingUp, Users, MapPin, DollarSign, Ship, Clock } from 'lucide-react';
import StatCard from './cards';
import RecentSchedules from './recent-schedules';
import PendingRequests from './pending-request';
import QuickActions from './Quick-actions';
import mockData from '../mockData.json';
import { formatCurrency } from '../utils/validation';
import { useOutletContext } from 'react-router-dom';

interface DashboardHomeProps {
  isDarkTheme?: boolean;
}

const DashboardHome: React.FC<DashboardHomeProps> = () => {
  const { dashboardStats, schedules, requests } = mockData;
  const { isDarkTheme } = useOutletContext<{ isDarkTheme: boolean }>();
  

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-6 shadow-lg shadow-blue-500/60">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-orange-100">
          Here's what's happening with your shipping operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Schedules"
          value={dashboardStats.activeSchedules}
          icon={Calendar}
          trend={{ value: '12% from last month', isPositive: true }}
          color="blue"
          isDarkTheme={isDarkTheme}
        />
        <StatCard
          title="Pending Requests"
          value={dashboardStats.pendingRequests}
          icon={Clock}
          trend={{ value: '3 new today', isPositive: false }}
          color="yellow"
          isDarkTheme={isDarkTheme}
        />
        <StatCard
          title="In Transit"
          value={dashboardStats.inTransitShipments}
          icon={Ship}
          trend={{ value: '5% on schedule', isPositive: true }}
          color="purple"
          isDarkTheme={isDarkTheme}
        />
        <StatCard
          title="Revenue (MTD)"
          value={formatCurrency(dashboardStats.revenueThisMonth)}
          icon={DollarSign}
          trend={{ value: '18% increase', isPositive: true }}
          color="green"
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`border rounded-xl p-4 ${
          isDarkTheme 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-600'
              }`}>Total Requests</p>
              <p className={`text-2xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>{dashboardStats.totalRequests}</p>
            </div>
            <Package className="w-10 h-10 text-cyan-400" />
          </div>
        </div>
        <div className={`border rounded-xl p-4 ${
          isDarkTheme 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-600'
              }`}>Active Stations</p>
              <p className={`text-2xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>{dashboardStats.totalStations}</p>
            </div>
            <MapPin className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <div className={`border rounded-xl p-4 ${
          isDarkTheme 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-600'
              }`}>Active Staff</p>
              <p className={`text-2xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>{dashboardStats.activeStaff}</p>
            </div>
            <Users className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className={`border rounded-xl p-4 ${
          isDarkTheme 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-600'
              }`}>Delivered</p>
              <p className={`text-2xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>{dashboardStats.deliveredShipments}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <RecentSchedules schedules={schedules} isDarkTheme={isDarkTheme} />
          <PendingRequests requests={requests} isDarkTheme={isDarkTheme} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <QuickActions isDarkTheme={isDarkTheme} />

          {/* Activity Chart Placeholder */}
          <div className={`border rounded-xl p-6 ${
            isDarkTheme 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>Request Status Overview</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Approved</span>
                  <span className="text-green-400">{dashboardStats.approvedRequests}</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(dashboardStats.approvedRequests / dashboardStats.totalRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>Pending</span>
                  <span className="text-yellow-400">{dashboardStats.pendingRequests}</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(dashboardStats.pendingRequests / dashboardStats.totalRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>In Transit</span>
                  <span className="text-blue-400">{dashboardStats.inTransitShipments}</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(dashboardStats.inTransitShipments / dashboardStats.totalRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;