import { Routes, Route, Navigate } from 'react-router-dom';
import { useRouteChange } from './hooks/useRouteChange';
import Login from './pages/auths/login';
import DashboardLayout from './pages/layout-components/dashboard-layout';
import Schedules from './pages/schedule/index';
import StationsPage from './pages/station/index';
import DashboardHome from './pages/dashbord/dashboard-home';
import UsersPage from './pages/users';
import RolesPage from './pages/roles-permission';
import ShippingRequestsSystem from './pages/requests';
import RoutesPage from './pages/routes';
import './App.css';
import SettingsPage from './pages/setting';

function NavigationIndicator() {
  const isNavigating = useRouteChange();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#ff8c42',
        opacity: isNavigating ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: isNavigating ? 'pulse 1.5s ease-in-out infinite' : 'none',
        boxShadow: '0 0 10px rgba(255, 140, 66, 0.5)',
      }}
    />
  );
}

function App() {
  return (
    <>
      <NavigationIndicator />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="stations" element={<StationsPage />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="Users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="requests" element={<ShippingRequestsSystem />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;