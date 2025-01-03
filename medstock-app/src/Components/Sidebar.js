import React from 'react';
import '../App.css';

function Sidebar() {
  return (
    <aside className="sidebar" >
      <div className="sidebar-header">
        <img url="../Assets/mslogo.png" alt="mslogo" />
        <h2><b>MedStock</b></h2>
      </div>
      <ul className="sidebar-links">
        <li><a href="#"><span className="material-symbols-outlined">overview</span>Inventory</a></li>

        <li><a href="../Medicine/medicine.html"><span className="material-symbols-outlined">pill</span>Medicines</a></li>

        <li><a href="orders.html"><span className="material-symbols-outlined"> inventory </span>Orders</a></li>
        
        <li><i className="fa-sharp fa-light fa-file-chart-pie"></i><a href="suppliers.html"><span className="material-symbols-outlined"> local_shipping </span>Suppliers</a></li>

        <li><a href="reports.html"><span className="material-symbols-outlined"> bar_chart </span>Reports</a></li>
      
        <li><a href="../Billing/billing.html"><span className="material-symbols-outlined"> receipt_long </span>Billing</a></li>

        <li><a href="notifications.html"><span className="material-symbols-outlined"> notifications </span>Notifications</a></li>
      
        <li><a href="users.html"><span className="material-symbols-outlined"> group </span>Users</a></li>
      
        <li><a href="profile.html"><span className="material-symbols-outlined"> account_circle </span>Profile</a></li>
        
        <li><a href="settings.html"><span className="material-symbols-outlined"> settings </span>Settings</a></li>
      
        <li><a href="logout.html"><span className="material-symbols-outlined"> logout </span>Logout</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
