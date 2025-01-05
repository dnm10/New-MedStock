import React from 'react';
import '../App.css';
import './Header.css';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header>
      <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
     
      <a className="navbar-brand">Smart Inventory Solutions!</a>

      <Link to="/" className="home-link">
        <span className="material-symbols-outlined">home</span>
      </Link>

      <div class="search-container">
          <input type="text" id="search" placeholder="Search..." />
          <button onclick="searchFunction()">🔍</button>
      </div>

      <Link to="/Notifications" className="notification-link">
        <span className="material-symbols-outlined">notifications</span>
      </Link>

      <button className="btn btn-outline-primary" id="signup-btn">SIGNUP</button>
    </div>
    </nav>
  </header>
  );
}

export default Header;
