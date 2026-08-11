import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar, isSidebarOpen }) => (
  <nav className={`flex items-center justify-between px-6 py-4 bg-white shadow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
    <div className="flex items-center space-x-4">
      <button onClick={toggleSidebar} className="text-2xl text-blue-600">
        <FaBars />
      </button>
      <span className="text-xl font-bold text-gray-800">Smart Inventory Solutions</span>
    </div>
    <div className="flex items-center space-x-6">
      <NavLink to="/Home" className="text-gray-700 hover:text-blue-600">Home</NavLink>
      <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
      <a href="#notifications" className="text-gray-700 hover:text-blue-600">Notifications</a>
      <a href="#about" className="text-gray-700 hover:text-blue-600">About Us</a>
      <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact Us</a>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Sign Up</button>
    </div>
  </nav>
);

export default Header;
