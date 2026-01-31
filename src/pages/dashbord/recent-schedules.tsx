import React from 'react';
import { Calendar, MapPin, Ship } from 'lucide-react';
import type { ShippingSchedule, ShipmentStatus } from '../../types';
import { formatDate } from '../utils/validation';

interface RecentSchedulesProps {
  schedules: ShippingSchedule[];
  isDarkTheme?: boolean;
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  almost_full: { label: 'Almost Full', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  full: { label: 'Full', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
};

const RecentSchedules: React.FC<RecentSchedulesProps> = ({ schedules, isDarkTheme = false }) => {
  return (
    <div className={`border rounded-xl p-6 ${
      isDarkTheme 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>Recent Schedules</h2>
        <button className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {schedules.slice(0, 5).map((schedule) => {
          const status = statusConfig[schedule.status];
          const capacityPercentage = ((schedule.totalCapacity - schedule.availableCapacity) / schedule.totalCapacity) * 100;

          return (
            <div
              key={schedule.id}
              className={`border rounded-lg p-4 transition-all ${
                isDarkTheme 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Ship className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>{schedule.cargoName}</h3>
                    <p className={`text-sm ${
                      isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {schedule.startingPoint} → {schedule.endingPoint}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className={`w-4 h-4 ${
                    isDarkTheme ? 'text-slate-400' : 'text-gray-500'
                  }`} />
                  <span className={isDarkTheme ? 'text-slate-300' : 'text-gray-700'}>
                    {formatDate(schedule.startingDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className={`w-4 h-4 ${
                    isDarkTheme ? 'text-slate-400' : 'text-gray-500'
                  }`} />
                  <span className={isDarkTheme ? 'text-slate-300' : 'text-gray-700'}>
                    {schedule.via.length > 0 ? `Via ${schedule.via.length} stops` : 'Direct'}
                  </span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div>
                <div className={`flex justify-between text-xs mb-1 ${
                  isDarkTheme ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  <span>Capacity</span>
                  <span>{schedule.availableCapacity} / {schedule.totalCapacity} available</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      capacityPercentage > 80 ? 'bg-red-500' : capacityPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentSchedules;