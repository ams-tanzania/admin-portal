import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Ship, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  MapPin, 
  Shield, 
  Settings,
  X,
  RouteIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme?: boolean; // Add theme prop
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isDarkTheme = false }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/users', icon: Users, label: 'Users' },
    { path: '/dashboard/schedules', icon: Calendar, label: 'Ship Schedules' },
    { path: '/dashboard/requests', icon: FileText, label: 'Requests' },
    { path: '/dashboard/stations', icon: MapPin, label: 'Stations' },
    { path: '/dashboard/routes', icon: RouteIcon, label: 'Routes' },
    { path: '/dashboard/roles', icon: Shield, label: 'Roles & Permissions' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkTheme 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkTheme ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/60">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>ShipSystem</h2>
              <p className={`text-xs ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-500'
              }`}>Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden transition-colors ${
              isDarkTheme 
                ? 'text-slate-400 hover:text-white' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-88px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-orange-400 to-orange-300 text-white shadow-lg shadow-blue-500/60'
                    : isDarkTheme
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;