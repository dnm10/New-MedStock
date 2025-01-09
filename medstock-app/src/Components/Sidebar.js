import React, {useState} from 'react';
import '../App.css';
import './SideBar.css';
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
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''}`} 
    onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="sidebar-header">
        <img src={mslogo} alt="mslogo" />
        <h2><b>MedStock</b></h2>
      </div>
      <ul className="sidebar-links">
        <li><Link to="/Inventory"><span className="material-symbols-outlined">overview</span>Inventory</Link></li>

        <li><Link to="/Medicine"><span className="material-symbols-outlined">pill</span>Medicines</Link></li>

        <li><Link to="orders.html"><span className="material-symbols-outlined"> inventory </span>Orders</Link></li>
        
        <li><i className="fa-sharp fa-light fa-file-chart-pie"></i><a href="suppliers.html"><span className="material-symbols-outlined"> local_shipping </span>Suppliers</a></li>

        <li><Link to="reports.html"><span className="material-symbols-outlined"> bar_chart </span>Reports</Link></li>
      
        <li><Link to="/Billing"><span className="material-symbols-outlined"> receipt_long </span>Billing</Link></li>

        <li><Link to="notifications.html"><span className="material-symbols-outlined"> notifications </span>Notifications</Link></li>
      
        <li><Link to="users.html"><span className="material-symbols-outlined"> group </span>Users</Link></li>
      
        <li><Link to="profile.html"><span className="material-symbols-outlined"> account_circle </span>Profile</Link></li>
        
        <li><Link to="settings.html"><span className="material-symbols-outlined"> settings </span>Settings</Link></li>
      
        <li><Link to="logout.html"><span className="material-symbols-outlined"> logout </span>Logout</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
