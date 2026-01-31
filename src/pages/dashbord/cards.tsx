import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'cyan';
  isDarkTheme?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/30',
    light: 'bg-blue-500/10 text-blue-400'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    shadow: 'shadow-green-500/30',
    light: 'bg-green-500/10 text-green-400'
  },
  yellow: {
    bg: 'from-yellow-500 to-yellow-600',
    shadow: 'shadow-yellow-500/30',
    light: 'bg-yellow-500/10 text-yellow-400'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/30',
    light: 'bg-purple-500/10 text-purple-400'
  },
  red: {
    bg: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/30',
    light: 'bg-red-500/10 text-red-400'
  },
  cyan: {
    bg: 'from-cyan-500 to-cyan-600',
    shadow: 'shadow-cyan-500/30',
    light: 'bg-cyan-500/10 text-cyan-400'
  }
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color,
  isDarkTheme = false 
}) => {
  const colors = colorClasses[color];

  return (
    <div className={`border rounded-xl p-6 transition-all ${
      isDarkTheme 
        ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${
            isDarkTheme ? 'text-slate-400' : 'text-gray-600'
          }`}>{title}</p>
          <h3 className={`text-3xl font-bold mb-2 ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>{value}</h3>
          {trend && (
            <div className={`inline-flex items-center text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'} {trend.value}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center shadow-lg ${colors.shadow}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;