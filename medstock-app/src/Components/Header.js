import React from 'react';
import '../App.css';
import './Header.css';
function Header() {
  return (
    <header>
      <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
     
      <a class="navbar-brand">Smart Inventory Solutions</a>

      <a href="#" class="home-link">
        <span class="material-symbols-outlined">home</span>
      </a>

      
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>

      
      <a href="notifications.html" class="notification-link">
        <span class="material-symbols-outlined">notifications</span>
      </a>

     
      <button class="btn btn-outline-primary" id="signup-btn">SIGNUP</button>
      <button class="btn btn-outline-secondary" id="login-btn">LOGIN</button>
    </div>
    </nav>
  </header>
  );
}

export default Header;
