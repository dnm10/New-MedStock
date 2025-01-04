import React from 'react';
import '../App.css';
import './Header.css';
function Header() {
  return (
    <header>
      <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
     
      <a className="navbar-brand">Smart Inventory Solutions</a>

      <a href="#" className="home-link">
        <span className="material-symbols-outlined">home</span>
      </a>

      <div class="search-container">
          <input type="text" id="search" placeholder="Search..." />
          <button onclick="searchFunction()">🔍</button>
      </div>

      <a href="notifications.html" className="notification-link">
        <span className="material-symbols-outlined">notifications</span>
      </a>

      <button className="btn btn-outline-primary" id="signup-btn">SIGNUP</button>
    </div>
    </nav>
  </header>
  );
}

export default Header;
