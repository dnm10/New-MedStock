import React, { useState, useEffect } from 'react';
import '../App.css';
import './Sidebar.css';
import mslogo from '../Assets/mslogo.png';
import { Link } from 'react-router-dom';
import { useRole } from './RoleContext';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { role } = useRole();
  const [userRole, setUserRole] = useState(role);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    document.body.classList.add('sidebar-expanded');
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    document.body.classList.remove('sidebar-expanded');
  };

  return (
    <aside
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <img src={mslogo} alt="MedStock Logo" />
        <h2>
          <b>MedStock</b>
        </h2>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/Home">
            <span className="material-symbols-outlined">home</span>Home
          </Link>
        </li>

        {/* Admin-Only Links */}
        {userRole === 'Admin' && (
          <>
            <li>
              <Link to="/Inventory">
                <span className="material-symbols-outlined">inventory_2</span>Inventory
              </Link>
            </li>

            <li>
              <Link to="/Orders">
                <span className="material-symbols-outlined">list_alt</span>Orders
              </Link>
            </li>

            <li>
              <Link to="/Supplier">
                <span className="material-symbols-outlined">local_shipping</span>Suppliers
              </Link>
            </li>

            <li>
              <Link to="/Reports">
                <span className="material-symbols-outlined">bar_chart</span>Reports
              </Link>
            </li>

            <li>
              <Link to="/Notifications">
                <span className="material-symbols-outlined">notifications</span>Notifications
              </Link>
            </li>

            <li>
              <Link to="/Users">
                <span className="material-symbols-outlined">group</span>Users
              </Link>
            </li>
          </>
        )}

        {/* Billing Link with Role-Based Routing */}
        <li>
          <Link to={userRole === 'Admin' ? "/Billing/Admin" : "/Billing/User"}>
            <span className="material-symbols-outlined">receipt_long</span>Billing
          </Link>
        </li>

        <li>
          <Link to="/Profile">
            <span className="material-symbols-outlined">account_circle</span>Profile
          </Link>
        </li>

        <li>
          <Link to="/Settings">
            <span className="material-symbols-outlined">settings</span>Settings
          </Link>
        </li>

        <li>
          <Link to="/">
            <span className="material-symbols-outlined">logout</span>Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
