import React from "react";
import "./Notifications.css";

const Notifications = () => {
  return (
    <div className="notifications">
      <h1>Stock Notifications</h1>
      <div className="notification-list">
        <div className="notification-card">
          <div className="notification-header">
            <span className="notification-title">Low stock alert for item A</span>
            <span className="notification-time">2 hours ago</span>
          </div>
          <div className="notification-body">
            <p>Item A is running low on stock, please restock soon.</p>
          </div>
        </div>
        <div className="notification-card">
          <div className="notification-header">
            <span className="notification-title">Stock arriving for item B tomorrow</span>
            <span className="notification-time">5 hours ago</span>
          </div>
          <div className="notification-body">
            <p>New stock of item B will arrive tomorrow. Prepare for restocking.</p>
          </div>
        </div>
        <div className="notification-card">
          <div className="notification-header">
            <span className="notification-title">Out of stock for item C</span>
            <span className="notification-time">1 day ago</span>
          </div>
          <div className="notification-body">
            <p>Item C is completely out of stock, please order more as soon as possible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
