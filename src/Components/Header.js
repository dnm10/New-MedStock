import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings && savedSettings.darkMode) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const existingSettings = JSON.parse(localStorage.getItem("userSettings")) || {};
    localStorage.setItem("userSettings", JSON.stringify({ ...existingSettings, darkMode: newDarkMode }));
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-2xl text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <FaBars />
        </button>
        <Link to="/Home" className="text-xl font-bold text-slate-900 dark:text-white">Smart Inventory Solutions</Link>
      </div>
      <nav className="hidden md:flex items-center space-x-1">
        <Link to="/Home" className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all font-medium">Home</Link>
        <Link to="/Home#features" className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all font-medium">Features</Link>
        <Link to="/Home#about" className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all font-medium">About Us</Link>
        <Link to="/Home#contact" className="text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all font-medium">Contact</Link>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
        
        <button 
          onClick={toggleDarkMode} 
          className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 p-2 transition-colors ml-1"
          title="Toggle Dark Mode"
        >
          {darkMode ? <FaSun className="text-xl text-amber-400" /> : <FaMoon className="text-xl" />}
        </button>
        
        <Link to="/Profile" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 p-2 transition-colors ml-1" title="Profile">
          <FaUserCircle className="text-2xl" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
