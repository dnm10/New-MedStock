import React from "react";
import "./Notifications.css";

const Notifications = () => {
  return (
    <div className="notification-page">
      <header>
        <h1>Notifications</h1>
      </header>


      <div className="cards-container">
        <div className="card low-stock">
          <span className="icon">⚠</span>
          <h3>Out of Stock Products</h3>
          <p>3 Products</p>
        </div>

        <div className="card arriving-stock">
          <span className="icon">🟢</span>
          <h3>Products on Low Stock</h3>
          <p>3 Products</p>
        </div>

        <div className="card out-of-stock">
          <span className="icon">❌</span>
          <h3>Products to Arrive</h3>
          <p>12 Products</p>
        </div>
      </div>

      <div className="gauge-container">
        <h3>Stock Percentage</h3>
        <div className="gauge">
          <div className="semi-circle"></div>
          <div className="percentage">100%</div>
        </div>
      </div>
    </div>
        


  );
};

export default Notifications;