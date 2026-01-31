import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './Navbar';
import '../dashbord/dashboard-home';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`min-h-screen ${
      isDarkTheme ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        isDarkTheme={isDarkTheme}
      />
      
      <div className="lg:ml-64">
        <Navbar 
          onMenuClick={toggleSidebar} 
          isDarkTheme={isDarkTheme}
          onToggleTheme={toggleTheme}
        />
        
        <main className="p-4 lg:p-6">
          <Outlet context={{ isDarkTheme }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;