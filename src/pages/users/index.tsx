import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Plus, Search, Edit2, Trash2, Eye, Mail, Phone, MapPin, Filter } from 'lucide-react';
import AddUser from './add';
import EditUser from './edit';
import ShowUser from './show';

// Types
export interface User {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User' | 'Customer' | 'Guest';
  createdAt: string;
}

// Main Users Component
const UsersPage: React.FC = () => {
  // Get theme from outlet context
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [view, setView] = useState<'list' | 'add' | 'edit' | 'show'>('list');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      fullName: 'John Mwangi',
      phone: '+255 712 345 678',
      location: 'Dar es Salaam, Tanzania',
      email: 'john.mwangi@email.com',
      role: 'Admin',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      fullName: 'Amina Hassan',
      phone: '+255 723 456 789',
      location: 'Zanzibar, Tanzania',
      email: 'amina.hassan@email.com',
      role: 'Manager',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      fullName: 'David Kamau',
      phone: '+254 720 123 456',
      location: 'Mombasa, Kenya',
      email: 'david.kamau@email.com',
      role: 'User',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      fullName: 'Fatuma Said',
      phone: '+255 745 678 901',
      location: 'Arusha, Tanzania',
      email: 'fatuma.said@email.com',
      role: 'User',
      createdAt: '2024-02-05'
    },
    {
      id: '5',
      fullName: 'Michael Ochieng',
      phone: '+254 711 222 333',
      location: 'Nairobi, Kenya',
      email: 'michael.ochieng@email.com',
      role: 'Guest',
      createdAt: '2024-02-10'
    }
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setView('list');
  };

  const handleEditUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
    setView('list');
    setSelectedUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      'from-orange-500 to-orange-400',
      'from-blue-500 to-blue-400',
      'from-green-500 to-green-400',
      'from-purple-500 to-purple-400',
      'from-pink-500 to-pink-400',
      'from-indigo-500 to-indigo-400'
    ];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'User':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Guest':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleColorDark = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'Manager':
        return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'User':
        return 'bg-green-900/30 text-green-400 border-green-800';
      case 'Guest':
        return 'bg-gray-900/30 text-gray-400 border-gray-800';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  if (view === 'add') {
    return <AddUser isDarkTheme={isDarkTheme} onSave={handleAddUser} onCancel={() => setView('list')} />;
  }

  if (view === 'edit' && selectedUser) {
    return <EditUser isDarkTheme={isDarkTheme} user={selectedUser} onSave={handleEditUser} onCancel={() => { setView('list'); setSelectedUser(null); }} />;
  }

  if (view === 'show' && selectedUser) {
    return <ShowUser isDarkTheme={isDarkTheme} user={selectedUser} onBack={() => { setView('list'); setSelectedUser(null); }} onEdit={() => setView('edit')} />;
  }

  return (
    <div className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h1>
        <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          Manage system users and their information
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search users by name, email, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`pl-10 pr-8 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <button
            onClick={() => setView('add')}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Total Users</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Admins</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {users.filter(u => u.role === 'Admin').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Managers</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {users.filter(u => u.role === 'Manager').length}
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
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>Active Users</p>
              <p className={`text-3xl font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {users.filter(u => u.role === 'User').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl border overflow-hidden ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  User
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Contact
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Location
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Role
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Created
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                      No users found
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
                      Try adjusting your search or add a new user
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`transition-colors ${isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className={`text-sm flex items-center gap-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        isDarkTheme ? getRoleColorDark(user.role) : getRoleColor(user.role)
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setView('show');
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkTheme
                              ? 'hover:bg-slate-600 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setView('edit');
                          }}
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
                          onClick={() => handleDeleteUser(user.id)}
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

export default UsersPage;