import React from 'react';
import '../App.css';
import './Header.css';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header>
      <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
     
      <b className="navbar-brand">Smart Inventory Solutions!</b>

      <Link to="/Home" className="home-link">
        <span className="material-symbols-outlined">home</span>
      </Link>

      <div class="search-container">
          <input type="text" id="search" placeholder="Search..." />
          <button onclick="searchFunction()">🔍</button>
      </div>

      <Link to="/Notifications" className="notification-link">
        <span className="material-symbols-outlined">notifications</span>
      </Link>

      <Link to="/">
      <button className="btn btn-outline-primary" id="signup-btn">SIGNUP</button>
      </Link>
    </div>
    </nav>
  </header>
  );
}

export default Header;
