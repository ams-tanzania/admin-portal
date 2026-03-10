import React from 'react';
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Building2, User as UserIcon, Info } from 'lucide-react';
import type { Customer } from '../api/api_services/customer';

const ShowCustomer: React.FC<{
  isDarkTheme: boolean;
  customer: Customer;
  onBack: () => void;
  onEdit: () => void;
}> = ({ isDarkTheme, customer, onBack, onEdit }) => {

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statusBadge = customer.status === 'active'
    ? isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200'
    : isDarkTheme ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button onClick={onBack} className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Customer Profile</h1>
            <p className={isDarkTheme ? 'text-slate-400' : 'text-gray-600'}>View complete customer information</p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" /> Edit Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                {getInitials(customer.full_name)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{customer.full_name}</h2>
                    {customer.company_name && (
                      <p className={`text-sm flex items-center gap-1 mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                        <Building2 className="w-4 h-4" /> {customer.company_name}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border capitalize ${statusBadge}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Info className="w-5 h-5" /> Contact Information
            </h3>
            <div className="space-y-4">
              {[
                { Icon: Mail, label: 'Email Address', value: customer.email, href: `mailto:${customer.email}`, color: 'blue' },
                { Icon: Phone, label: 'Phone Number', value: customer.phone, href: `tel:${customer.phone}`, color: 'green' },
                { Icon: MapPin, label: 'Address', value: `${customer.address}, ${customer.city}, ${customer.country}`, href: null, color: 'orange' },
              ].map(({ Icon, label, value, href, color }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkTheme ? `bg-${color}-900/30` : `bg-${color}-100`}`}>
                    <Icon className={`w-6 h-6 ${isDarkTheme ? `text-${color}-400` : `text-${color}-600`}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{label}</p>
                    {href ? (
                      <a href={href} className={`text-lg font-semibold hover:underline ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{value}</a>
                    ) : (
                      <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <UserIcon className="w-5 h-5" /> Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Customer ID', value: customer.id, mono: true },
                { label: 'City', value: customer.city },
                { label: 'Country', value: customer.country },
                { label: 'Account Status', value: customer.status, capitalize: true, green: customer.status === 'active' },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{item.label}</p>
                  <p className={`text-base font-semibold truncate ${
                    item.green !== undefined
                      ? item.green ? (isDarkTheme ? 'text-green-400' : 'text-green-600') : (isDarkTheme ? 'text-red-400' : 'text-red-600')
                      : isDarkTheme ? 'text-white' : 'text-gray-900'
                  } ${item.mono ? 'font-mono text-sm' : ''} ${item.capitalize ? 'capitalize' : ''}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
          <div className={`rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Edit Profile', Icon: Edit2, onClick: onEdit, href: null },
                { label: 'Send Email', Icon: Mail, onClick: null, href: `mailto:${customer.email}` },
                { label: 'Call Customer', Icon: Phone, onClick: null, href: `tel:${customer.phone}` },
                { label: 'Back to List', Icon: ArrowLeft, onClick: onBack, href: null },
              ].map(({ label, Icon, onClick, href }) => {
                const cls = `w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`;
                return href ? (
                  <a key={label} href={href} className={cls}><Icon className="w-4 h-4" />{label}</a>
                ) : (
                  <button key={label} onClick={onClick!} className={cls}><Icon className="w-4 h-4" />{label}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCustomer;