import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Package, MapPin, Calendar, Hash, User,
  Mail, Phone, Image as ImageIcon, Loader2,
} from 'lucide-react';
import { getShipmentById, type Shipment } from '../api/api_services/shipment';

const BASE_URL =  'https://ams.mzugu.me.tz';

const ShowShipmentPage: React.FC<{
  isDarkTheme: boolean;
  shipment: Shipment;
  onClose: () => void;
  onRefresh: () => void;
}> = ({ isDarkTheme, shipment: initialShipment, onClose }) => {
  const [shipment, setShipment] = useState<Shipment>(initialShipment);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getShipmentById(initialShipment.id);
        setShipment(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load shipment details');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [initialShipment.id]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const getShipmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':  return 'bg-green-500 text-white';
      case 'in transit': return 'bg-blue-500 text-white';
      case 'pending':    return 'bg-yellow-500 text-white';
      case 'cancelled':  return 'bg-red-500 text-white';
      default:           return 'bg-slate-500 text-white';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':    return 'bg-green-500 text-white';
      case 'pending': return 'bg-orange-500 text-white';
      case 'failed':  return 'bg-red-500 text-white';
      default:        return 'bg-slate-500 text-white';
    }
  };

  const card = `rounded-xl border p-6 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`;
  const label = `text-xs font-medium uppercase tracking-wide mb-1 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`;
  const val = `font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className={`w-10 h-10 animate-spin ${isDarkTheme ? 'text-orange-400' : 'text-orange-500'}`} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={onClose} className="text-orange-500 hover:underline text-sm flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <button onClick={onClose} className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Shipments
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Shipment Details</h1>
            <p className={`font-mono text-sm ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`}>{shipment.tracking_number}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getShipmentStatusColor(shipment.shipment_status)}`}>
              {shipment.shipment_status}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPaymentStatusColor(shipment.payment_status)}`}>
              {shipment.payment_status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Shipment Image */}
          {shipment.shipment_image && (
            <div className={card}>
              <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                <ImageIcon className="w-4 h-4 text-orange-400" /> Shipment Image
              </h3>
              <img
                src={`${BASE_URL}/${shipment.shipment_image}`}
                alt="Shipment"
                className="w-full max-h-72 object-contain rounded-xl"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* Route */}
          <div className={card}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <MapPin className="w-4 h-4 text-orange-400" /> Route
            </h3>
            <div className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-between`}>
              <div>
                <p className={label}>Origin</p>
                <p className={`${val} flex items-center gap-1`}><MapPin className="w-4 h-4 text-blue-400" />{shipment.origin}</p>
              </div>
              <div className="text-2xl text-slate-400">→</div>
              <div className="text-right">
                <p className={label}>Destination</p>
                <p className={`${val} flex items-center gap-1 justify-end`}><MapPin className="w-4 h-4 text-green-400" />{shipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={card}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="w-4 h-4 text-orange-400" /> Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Departure Date', value: formatDate(shipment.departure_date), color: 'from-blue-500 to-blue-400' },
                { label: 'Est. Arrival Date', value: formatDate(shipment.estimated_arrival_date), color: 'from-green-500 to-green-400' },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <p className={label}>{item.label}</p>
                  <p className={`text-sm ${val}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={card}>
            <h3 className={`text-base font-semibold mb-3 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              <Package className="w-4 h-4 text-orange-400" /> Description
            </h3>
            <p className={`leading-relaxed ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>{shipment.description}</p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className={card}>
            <h3 className={`text-base font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Quick Info</h3>
            <div className="space-y-4">
              {/* Tracking */}
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1"><Hash className="w-3 h-3 text-orange-400" /><p className={label}>Tracking #</p></div>
                <p className={`font-mono text-xs font-bold ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`}>{shipment.tracking_number}</p>
              </div>

              {/* Batch */}
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1"><Package className="w-3 h-3 text-blue-400" /><p className={label}>Batch</p></div>
                <p className={`font-mono text-xs font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>{shipment.batch_number}</p>
              </div>

              {/* Shipment Status */}
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`${label} mb-2`}>Shipment Status</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getShipmentStatusColor(shipment.shipment_status)}`}>
                  {shipment.shipment_status}
                </span>
              </div>

              {/* Payment Status */}
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <p className={`${label} mb-2`}>Payment Status</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(shipment.payment_status)}`}>
                  {shipment.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className={card}>
            <h3 className={`text-base font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Customer</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {shipment.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{shipment.customer_name}</p>
                </div>
              </div>
              <div className={`space-y-2 pt-2 border-t ${isDarkTheme ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className={`w-4 h-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                  <span className={isDarkTheme ? 'text-slate-300' : 'text-gray-700'}>{shipment.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className={`w-4 h-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                  <span className={isDarkTheme ? 'text-slate-300' : 'text-gray-700'}>{shipment.customer_phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${isDarkTheme ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowShipmentPage;