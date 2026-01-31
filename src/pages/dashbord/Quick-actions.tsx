import React from 'react';
import { Plus, Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  isDarkTheme?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ isDarkTheme = false }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calendar,
      label: 'New Schedule',
      description: 'Create a new shipping schedule',
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/dashboard/schedules')
    },
    {
      icon: MapPin,
      label: 'Add Station',
      description: 'Register a new station',
      color: 'from-green-500 to-green-600',
      onClick: () => navigate('/dashboard/stations')
    },
    {
      icon: Users,
      label: 'Add Staff',
      description: 'Onboard new team member',
      color: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/dashboard/staff')
    }
  ];

  return (
    <div className={`border rounded-xl p-6 ${
      isDarkTheme 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${
        isDarkTheme ? 'text-white' : 'text-gray-900'
      }`}>Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full flex items-center space-x-4 p-4 border rounded-lg transition-all group ${
                isDarkTheme 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-semibold mb-1 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>{action.label}</h3>
                <p className={`text-sm ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                }`}>{action.description}</p>
              </div>
              <Plus className={`w-5 h-5 transition-colors ${
                isDarkTheme 
                  ? 'text-slate-400 group-hover:text-white' 
                  : 'text-gray-400 group-hover:text-gray-900'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;