import React, { useState } from 'react';
import { ArrowLeft, Save, Shield, Check, X } from 'lucide-react';
import type { Role, Permission } from './index';
import { SYSTEM_MODULES } from './index';

// Add Role Component
const AddRole: React.FC<{
  isDarkTheme: boolean;
  onSave: (role: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => void;
  onCancel: () => void;
}> = ({ isDarkTheme, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    roleName: '',
    description: ''
  });

  const [permissions, setPermissions] = useState<Permission[]>(
    SYSTEM_MODULES.map((module, idx) => ({
      id: `new-${idx}`,
      module,
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false
    }))
  );

  const [errors, setErrors] = useState({
    roleName: '',
    description: ''
  });

  const validateForm = () => {
    const newErrors = {
      roleName: formData.roleName ? '' : 'Role name is required',
      description: formData.description ? '' : 'Description is required'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        permissions
      });
    }
  };

  const togglePermission = (moduleIndex: number, permissionType: keyof Omit<Permission, 'id' | 'module'>) => {
    setPermissions(prev => prev.map((perm, idx) => {
      if (idx === moduleIndex) {
        const newPerm = { ...perm, [permissionType]: !perm[permissionType] };
        
        // Auto-enable view when any other permission is enabled
        if ((permissionType !== 'canView') && !perm[permissionType]) {
          newPerm.canView = true;
        }
        
        // Auto-disable other permissions when view is disabled
        if (permissionType === 'canView' && perm.canView) {
          newPerm.canCreate = false;
          newPerm.canEdit = false;
          newPerm.canDelete = false;
        }
        
        return newPerm;
      }
      return perm;
    }));
  };

  const toggleAllForModule = (moduleIndex: number, enable: boolean) => {
    setPermissions(prev => prev.map((perm, idx) => {
      if (idx === moduleIndex) {
        return {
          ...perm,
          canView: enable,
          canCreate: enable,
          canEdit: enable,
          canDelete: enable
        };
      }
      return perm;
    }));
  };

  const setPresetPermissions = (preset: 'admin' | 'manager' | 'user' | 'guest') => {
    setPermissions(prev => prev.map(perm => {
      switch (preset) {
        case 'admin':
          return { ...perm, canView: true, canCreate: true, canEdit: true, canDelete: true };
        case 'manager':
          return {
            ...perm,
            canView: true,
            canCreate: perm.module !== 'Roles & Permissions' && perm.module !== 'Settings',
            canEdit: perm.module !== 'Roles & Permissions' && perm.module !== 'Settings',
            canDelete: perm.module === 'Requests' || perm.module === 'Ship Schedules'
          };
        case 'user':
          return {
            ...perm,
            canView: perm.module !== 'Roles & Permissions' && perm.module !== 'Settings',
            canCreate: perm.module === 'Requests',
            canEdit: perm.module === 'Requests',
            canDelete: false
          };
        case 'guest':
          return {
            ...perm,
            canView: perm.module === 'Dashboard' || perm.module === 'Ship Schedules' || perm.module === 'Stations',
            canCreate: false,
            canEdit: false,
            canDelete: false
          };
        default:
          return perm;
      }
    }));
  };

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? 'text-slate-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roles
        </button>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Add New Role
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Create a new role and configure permissions
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5" />
            Basic Information
          </h3>

          <div className="space-y-4">
            {/* Role Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.roleName ? 'border-red-500' : ''}`}
                placeholder="e.g., Senior Manager, Operations Lead"
              />
              {errors.roleName && (
                <p className="mt-1 text-sm text-red-500">{errors.roleName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkTheme
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Brief description of this role's responsibilities"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Permission Presets */}
        <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Quick Presets
          </h3>
          <p className={`text-sm mb-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
            Start with a preset and customize as needed
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setPresetPermissions('admin')}
              className={`px-4 py-3 rounded-xl border transition-colors ${
                isDarkTheme
                  ? 'border-purple-800 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30'
                  : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setPresetPermissions('manager')}
              className={`px-4 py-3 rounded-xl border transition-colors ${
                isDarkTheme
                  ? 'border-blue-800 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                  : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setPresetPermissions('user')}
              className={`px-4 py-3 rounded-xl border transition-colors ${
                isDarkTheme
                  ? 'border-green-800 bg-green-900/20 text-green-400 hover:bg-green-900/30'
                  : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setPresetPermissions('guest')}
              className={`px-4 py-3 rounded-xl border transition-colors ${
                isDarkTheme
                  ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Guest
            </button>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6 pb-0">
            <h3 className={`text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Permission Matrix
            </h3>
            <p className={`text-sm mb-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
              Configure specific permissions for each module
            </p>
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
                  <th className={`px-6 py-4 text-center text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    All
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {permissions.map((permission, index) => (
                  <tr key={permission.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {permission.module}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => togglePermission(index, 'canView')}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          permission.canView
                            ? 'bg-blue-500 text-white'
                            : isDarkTheme
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {permission.canView ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => togglePermission(index, 'canCreate')}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          permission.canCreate
                            ? 'bg-green-500 text-white'
                            : isDarkTheme
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {permission.canCreate ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => togglePermission(index, 'canEdit')}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          permission.canEdit
                            ? 'bg-yellow-500 text-white'
                            : isDarkTheme
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {permission.canEdit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => togglePermission(index, 'canDelete')}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          permission.canDelete
                            ? 'bg-red-500 text-white'
                            : isDarkTheme
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {permission.canDelete ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          const allEnabled = permission.canView && permission.canCreate && permission.canEdit && permission.canDelete;
                          toggleAllForModule(index, !allEnabled);
                        }}
                        className={`text-sm font-medium transition-colors ${
                          isDarkTheme
                            ? 'text-orange-400 hover:text-orange-300'
                            : 'text-orange-600 hover:text-orange-700'
                        }`}
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Role
          </button>
          <button
            onClick={onCancel}
            className={`flex-1 px-6 py-3 rounded-xl font-medium border transition-colors ${
              isDarkTheme
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;