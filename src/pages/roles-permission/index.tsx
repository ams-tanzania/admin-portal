import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, Plus, Search, Edit2, Trash2, Eye, Check, X, Users } from 'lucide-react';
import AddRole from './add'
import EditRole from './edit';
import ShowRole from './show';

// Types
export interface Permission {
  id: string;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Role {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  createdAt: string;
}

// Available system modules
export const SYSTEM_MODULES = [
  'Dashboard',
  'Ship Schedules',
  'Requests',
  'Stations',
  'Users',
  'Roles & Permissions',
  'Settings',
  'Staff Management',
  'Request Configurations'
];

// Main Roles & Permissions Component
const RolesPage: React.FC = () => {
  // Get theme from outlet context
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit' | 'show'>('list');
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      roleName: 'Admin',
      description: 'Full system access with all administrative privileges',
      userCount: 2,
      permissions: SYSTEM_MODULES.map((module, idx) => ({
        id: `1-${idx}`,
        module,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true
      })),
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      roleName: 'Manager',
      description: 'Elevated permissions for managing operations and staff',
      userCount: 5,
      permissions: SYSTEM_MODULES.map((module, idx) => ({
        id: `2-${idx}`,
        module,
        canView: true,
        canCreate: module !== 'Roles & Permissions' && module !== 'Settings',
        canEdit: module !== 'Roles & Permissions' && module !== 'Settings',
        canDelete: module === 'Requests' || module === 'Ship Schedules'
      })),
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      roleName: 'User',
      description: 'Standard user access for viewing and basic operations',
      userCount: 12,
      permissions: SYSTEM_MODULES.map((module, idx) => ({
        id: `3-${idx}`,
        module,
        canView: module !== 'Roles & Permissions' && module !== 'Settings',
        canCreate: module === 'Requests',
        canEdit: module === 'Requests',
        canDelete: false
      })),
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      roleName: 'Guest',
      description: 'Limited view-only access for external users',
      userCount: 8,
      permissions: SYSTEM_MODULES.map((module, idx) => ({
        id: `4-${idx}`,
        module,
        canView: module === 'Dashboard' || module === 'Ship Schedules' || module === 'Stations',
        canCreate: false,
        canEdit: false,
        canDelete: false
      })),
      createdAt: '2024-01-20'
    }
  ]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddRole = (role: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => {
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRole]);
    setView('list');
  };

  const handleEditRole = (role: Role) => {
    setRoles(roles.map(r => r.id === role.id ? role : r));
    setView('list');
    setSelectedRole(null);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.userCount > 0) {
      alert(`Cannot delete role "${role.roleName}" because it has ${role.userCount} assigned users. Please reassign users first.`);
      return;
    }
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return 'from-purple-500 to-purple-400';
      case 'Manager':
        return 'from-blue-500 to-blue-400';
      case 'User':
        return 'from-green-500 to-green-400';
      case 'Guest':
        return 'from-gray-500 to-gray-400';
      default:
        return 'from-orange-500 to-orange-400';
    }
  };

  if (view === 'add') {
    return <AddRole isDarkTheme={isDarkTheme} onSave={handleAddRole} onCancel={() => setView('list')} />;
  }

  if (view === 'edit' && selectedRole) {
    return <EditRole isDarkTheme={isDarkTheme} role={selectedRole} onSave={handleEditRole} onCancel={() => { setView('list'); setSelectedRole(null); }} />;
  }

  if (view === 'show' && selectedRole) {
    return <ShowRole isDarkTheme={isDarkTheme} role={selectedRole} onBack={() => { setView('list'); setSelectedRole(null); }} onEdit={() => setView('edit')} />;
  }

  return (
    <div className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Roles & Permissions
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage system roles and define access permissions
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search roles..."
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
          Add Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Total Roles</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{roles.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Total Users</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>System Modules</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {SYSTEM_MODULES.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Custom Roles</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {roles.filter(r => !['Admin', 'Manager', 'User', 'Guest'].includes(r.roleName)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.length === 0 ? (
          <div className={`col-span-2 rounded-xl border p-12 text-center ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <Shield className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
            <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
              No roles found
            </p>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
              Try adjusting your search or add a new role
            </p>
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div
              key={role.id}
              className={`rounded-xl border p-6 transition-all hover:shadow-lg ${
                isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Role Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(role.roleName)} rounded-xl flex items-center justify-center`}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {role.roleName}
                    </h3>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      {role.userCount} {role.userCount === 1 ? 'user' : 'users'} assigned
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setView('show');
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkTheme
                        ? 'hover:bg-slate-700 text-slate-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setView('edit');
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkTheme
                        ? 'hover:bg-slate-700 text-slate-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkTheme
                        ? 'hover:bg-red-900/20 text-red-400'
                        : 'hover:bg-red-50 text-red-600'
                    }`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                {role.description}
              </p>

              {/* Permissions Summary */}
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  PERMISSIONS SUMMARY
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                      {role.permissions.filter(p => p.canView).length}
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      View
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                      {role.permissions.filter(p => p.canCreate).length}
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      Create
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {role.permissions.filter(p => p.canEdit).length}
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      Edit
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
                      {role.permissions.filter(p => p.canDelete).length}
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      Delete
                    </div>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div className={`mt-4 pt-4 border-t ${isDarkTheme ? 'border-slate-700' : 'border-gray-200'}`}>
                <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                  Created {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RolesPage;