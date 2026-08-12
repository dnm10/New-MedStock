import React from 'react';
import mslogo from '../Assets/mslogo.png';

function FormPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none [&.show-popup]:opacity-100 [&.show-popup]:pointer-events-auto transition-all duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm -z-10"></div>
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl flex overflow-hidden relative transform scale-95 [&.show-popup]:scale-100 transition-transform duration-300">
        <span className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer material-symbols-rounded z-20">close</span>

        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col w-2/5 bg-primary-50 dark:bg-slate-700 items-center justify-center p-8 border-r border-slate-100 dark:border-slate-600">
          <img src={mslogo} alt="logo" className="w-32 h-auto drop-shadow-md mb-4" />
          <h3 className="text-xl font-bold text-primary-700 dark:text-primary-300 text-center">MedStock</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">Manage your inventory smartly.</p>
        </div>

        {/* Right Side Content - Login (as placeholder since logic is in AuthForm.js) */}
        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Authentication</h2>
          
          <form id="loginForm" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" id="loginEmail" required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" id="loginPassword" required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            
            <div className="flex space-x-4 py-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" id="loginAdmin" name="loginType" value="Admin" required className="text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Admin</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" id="loginUser" name="loginType" value="User" required className="text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">User</span>
              </label>
            </div>
            
            <button type="button" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all">Log In</button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account? {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#!" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPopup;
