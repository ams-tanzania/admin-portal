import React from 'react';
import { ArrowLeft, Edit2, Shield, Check, X, Users, Calendar, Info } from 'lucide-react';
import type { Role } from './index';

// Show Role Component
const ShowRole: React.FC<{
  isDarkTheme: boolean;
  role: Role;
  onBack: () => void;
  onEdit: () => void;
}> = ({ isDarkTheme, role, onBack, onEdit }) => {
  
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

  const getPermissionSummary = () => {
    return {
      view: role.permissions.filter(p => p.canView).length,
      create: role.permissions.filter(p => p.canCreate).length,
      edit: role.permissions.filter(p => p.canEdit).length,
      delete: role.permissions.filter(p => p.canDelete).length
    };
  };

  const summary = getPermissionSummary();

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? 'text-slate-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roles
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Role Details
            </h1>
            <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              View complete role information and permissions
            </p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Role
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Overview Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-6 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(role.roleName)} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {role.roleName}
                </h2>
                <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Created on {new Date(role.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className={`${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  {role.description}
                </p>
              </div>
            </div>

            {/* Permission Summary Stats */}
            <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                PERMISSIONS SUMMARY
              </p>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                    {summary.view}
                  </div>
                  <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    View Access
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                    {summary.create}
                  </div>
                  <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Create Access
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {summary.edit}
                  </div>
                  <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Edit Access
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
                    {summary.delete}
                  </div>
                  <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                    Delete Access
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Permissions Table */}
          <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="p-6 pb-0">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Detailed Permissions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      Module
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      View
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      Create
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      Edit
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {role.permissions.map((permission) => (
                    <tr key={permission.id} className={`${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {permission.module}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {permission.canView ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isDarkTheme ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {permission.canCreate ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isDarkTheme ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {permission.canEdit ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isDarkTheme ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {permission.canDelete ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isDarkTheme ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Info className="w-5 h-5" />
              Quick Information
            </h3>
            
            <div className="space-y-4">
              {/* Role ID */}
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Role ID
                </p>
                <p className={`text-lg font-mono font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  #{role.id}
                </p>
              </div>

              {/* Assigned Users */}
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Assigned Users
                </p>
                <div className="flex items-center gap-2">
                  <Users className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
                  <p className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {role.userCount}
                  </p>
                </div>
                <p className={`text-xs mt-1 ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  {role.userCount === 1 ? 'user has' : 'users have'} this role
                </p>
              </div>

              {/* Created Date */}
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  Created Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`} />
                  <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(role.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Total Modules */}
              <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                  System Modules
                </p>
                <p className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {role.permissions.length}
                </p>
                <p className={`text-xs mt-1 ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'}`}>
                  Total configured modules
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={onEdit}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit Role
              </button>
              <button
                onClick={onBack}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>
          </div>

          {/* Permission Legend */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Permission Types
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>View</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Can view module data</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Create</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Can create new records</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Edit</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Can modify existing records</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Delete</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>Can delete records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowRole;