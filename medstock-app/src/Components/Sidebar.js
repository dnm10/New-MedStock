import React, {useState} from 'react';
import '../App.css';
import './Sidebar.css';
import mslogo from '../Assets/mslogo.png';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    document.body.classList.add('sidebar-expanded');
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    document.body.classList.remove('sidebar-expanded');
  };

  return (
    <aside className="sidebar" >
      <div className="sidebar-header">
        <img src={mslogo} alt="mslogo" />
        <h2><b>MedStock</b></h2>
      </div>
      <ul className="sidebar-links">
        <li><Link to="/Inventory"><span className="material-symbols-outlined">overview</span>Inventory</Link></li>

        <li><Link to="/Medicine"><span className="material-symbols-outlined">pill</span>Medicines</Link></li>

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
