import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { FaExclamationCircle, FaExclamationTriangle, FaTimesCircle, FaBoxOpen } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    summary: { outOfStock: 0, lowStock: 0, arrivingStock: 0, stockPercentage: 100 },
    lowStockItems: [],
    expiredItems: [],
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        console.log("Received Notifications Data:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 px-5 md:px-8 mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">System Notifications</h1>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* System Status Banner */}
        <div className="bg-primary-50 border border-primary-200 text-primary-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <FaExclamationCircle className="text-2xl text-primary-600" />
            <span className="font-semibold text-lg">System Status</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <span>Current Stock Level: <strong className="text-primary-700">{notifications.summary.stockPercentage}%</strong></span>
            <span>Low Stock Items: <strong className="text-amber-600">{notifications.summary.lowStock}</strong></span>
            <span>Expired Items: <strong className="text-rose-600">{notifications.expiredItems.length}</strong></span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Out of Stock Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-rose-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-0"></div>
            <div className="flex items-center gap-4 mb-4 z-10">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
                <FaTimesCircle className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Out of Stock</h3>
                <p className="text-3xl font-extrabold text-rose-600">{notifications.summary.outOfStock}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto pt-4">Products currently unavailable</p>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-amber-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-0"></div>
            <div className="flex items-center gap-4 mb-4 z-10">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                <FaExclamationTriangle className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Low Stock</h3>
                <p className="text-3xl font-extrabold text-amber-600">{notifications.summary.lowStock}</p>
              </div>
            </div>
            
            {notifications.lowStockItems.length > 0 ? (
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 max-h-48 overflow-y-auto custom-scrollbar z-10 pr-2">
                {notifications.lowStockItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                    <span className="font-medium truncate mr-2">{item.name}</span>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-bold whitespace-nowrap">{item.quantity} left</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto z-10 pt-4">All stock levels are optimal</p>
            )}
          </div>

          {/* Expired Stock Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-rose-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-0"></div>
            <div className="flex items-center gap-4 mb-4 z-10">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
                <FaTimesCircle className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Expired Items</h3>
                <p className="text-3xl font-extrabold text-rose-600">{notifications.expiredItems.length}</p>
              </div>
            </div>

            {notifications.expiredItems.length > 0 ? (
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 max-h-48 overflow-y-auto custom-scrollbar z-10 pr-2">
                {notifications.expiredItems.map((item, index) => (
                  <li key={index} className="flex flex-col bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-rose-100">
                    <span className="font-medium text-slate-800 dark:text-slate-100 truncate">{item.name}</span>
                    <span className="text-rose-600 text-xs font-semibold mt-1">Expired: {new Date(item.expiryDate).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto z-10 pt-4">No expired items found</p>
            )}
          </div>

          {/* Arriving Stock Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-emerald-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-0"></div>
            <div className="flex items-center gap-4 mb-4 z-10">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                <FaBoxOpen className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Arriving Soon</h3>
                <p className="text-3xl font-extrabold text-emerald-600">{notifications.summary.arrivingStock}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto z-10 pt-4">Products on the way from suppliers</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Notifications;