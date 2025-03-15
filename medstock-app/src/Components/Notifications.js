import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    summary: { outOfStock: 0, lowStock: 0, arrivingStock: 0, stockPercentage: 100 },
    lowStockItems: [],
    expiredItems: [],
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/notifications")
      .then((response) => {
        console.log("Received Notifications Data:", response.data); // Debugging
        setNotifications(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);
  

  return (
    <div className="notification-page">
      <header>
        <h1>Notifications</h1>
      </header>

      <div className="cards-container">
        <div className="card out-of-stock">
          <span className="icon">❌</span>
          <h3>Out of Stock</h3>
          <p>{notifications.summary.outOfStock} Products</p>
        </div>

        <div className="card low-stock">
          <span className="icon">⚠</span>
          <h3>Low Stock</h3>
          <p>{notifications.summary.lowStock} Products</p>
          {notifications.lowStockItems.length > 0 && (
            <ul>
              {notifications.lowStockItems.map((item, index) => (
                <li key={index}>{item.name} - {item.quantity} left</li>
              ))}
            </ul>
          )}
        </div>

        <div className="card expired-stock">
          <span className="icon">🛑</span>
          <h3>Expired Items</h3>
          <p>{notifications.expiredItems.length} Products</p>
          {notifications.expiredItems.length > 0 && (
            <ul>
              {notifications.expiredItems.map((item, index) => (
                <li key={index}>{item.name} (Expired on {new Date(item.expiry_date).toLocaleDateString()})</li>
              ))}
            </ul>
          )}
        </div>

        <div className="card arriving-stock">
          <span className="icon">🟢</span>
          <h3>Arriving Stock</h3>
          <p>{notifications.summary.arrivingStock} Products</p>
        </div>
      </div>

      <div className="gauge-container">
        <h3>Stock Percentage</h3>
        <div className="gauge">
          <div className="semi-circle"></div>
          <div className="percentage">{notifications.summary.stockPercentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
