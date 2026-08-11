import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import mslogo from '../Assets/mslogo.png';
import { FaBox, FaTruck, FaHome, FaChartBar, FaMoneyBill, FaBell, FaUser, FaCog } from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

  const sidebarItems = [
    { id: 'inventory', label: 'Inventory', icon: <FaBox />, path: '/Inventory' },
    { id: 'orders', label: 'Orders', icon: <FaTruck />, path: '/Orders' },
    { id: 'suppliers', label: 'Suppliers', icon: <FaHome />, path: '/Supplier' },
    { id: 'reports', label: 'Reports', icon: <FaChartBar />, path: '/Reports' },
    { id: 'billing', label: 'Billing', icon: <FaMoneyBill />, path: '/Billing/User' },
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, path: '/Notifications' },
    { id: 'users', label: 'Users', icon: <FaUser />, path: '/Users' },
    { id: 'profile', label: 'Profile', icon: <FaUser />, path: '/Profile' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/Settings' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <img src={mslogo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-gray-800">MedStock</span>
        </div>
        <button onClick={closeSidebar} className="text-xl text-gray-600">
          <FaTimes />
        </button>
      </div>
      <ul className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-blue-100 ${location.pathname === item.path ? 'bg-blue-100 font-semibold' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
