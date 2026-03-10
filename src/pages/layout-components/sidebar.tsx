import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  MapPin,
  Shield,
  Settings,
  X,
  RouteIcon,
  ChevronDown,
  ChevronRight,
  UsersRound,
  UserCheck,
  UserCog,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isDarkTheme = false,
}) => {
  const location = useLocation();
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/schedules", icon: Calendar, label: "Ship Schedules" },
    { path: "/dashboard/requests", icon: FileText, label: "Requests" },
    { path: "/dashboard/stations", icon: MapPin, label: "Stations" },
    { path: "/dashboard/routes", icon: RouteIcon, label: "Routes" },
    { path: "/dashboard/roles", icon: Shield, label: "Roles & Permissions" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const userSubItems = [
    { path: "/dashboard/users", icon: UsersRound, label: "All Users" },
    { path: "/dashboard/users/customers", icon: UserCheck, label: "Customers" },
    { path: "/dashboard/users/staffs", icon: UserCog, label: "Staffs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const isUsersActive = userSubItems.some((item) =>
    location.pathname.startsWith(item.path)
  );

  // Auto-open dropdown if a users sub-route is active
  React.useEffect(() => {
    if (isUsersActive) setUsersDropdownOpen(true);
  }, [isUsersActive]);

  const activeLinkClass = isDarkTheme
    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
    : "bg-orange-50 text-orange-600 border border-orange-200";

  const inactiveLinkClass = isDarkTheme
    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

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
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDarkTheme
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkTheme ? "border-slate-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-white to-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/60">
              <img
                src="/admin-portal/logo.png"
                className="rounded-2xl"
                alt="Logo"
              />
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                AMS Tanzania
              </h2>
              <p
                className={`text-xs ${
                  isDarkTheme ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Admin Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden transition-colors ${
              isDarkTheme
                ? "text-slate-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
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
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active ? activeLinkClass : inactiveLinkClass
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Users Dropdown */}
          <div>
            <button
              onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isUsersActive ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Users</span>
              </div>
              {usersDropdownOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Sub Items */}
            {usersDropdownOpen && (
              <div className="mt-1 ml-4 pl-4 border-l space-y-1 border-orange-400/40">
                {userSubItems.map((sub) => {
                  const SubIcon = sub.icon;
                  const active = isActive(sub.path);
                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                        active ? activeLinkClass : inactiveLinkClass
                      }`}
                    >
                      <SubIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;