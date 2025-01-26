import React from 'react'
import '../App.css';
import './footer.css';
import mslogoed from '../Assets/mslogoed.png';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer>
    <div className="content">
        <div className="top">
            <div className="logo-details">
              <img src={mslogoed} alt="logo"/>
                <span className="logo_name">MedStock</span>
            </div>
        </div>
        <div className="link-boxes">
            <ul className="box">
                <li><a href="#">Home</a></li>
                <li><a href="../contactus/contact.html">Contact us</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Get started</a></li>
            </ul>
            <ul className="box">
            <li><Link to="/Inventory">Inventory</Link></li>
            <li><Link to="/Orders">Orders</Link></li>
            <li><Link to="/Supplier">Suppliers</Link></li>
            <li><Link to="/Reports">Reports</Link></li>
            <li><Link to="/Billing">Billing</Link></li>
            <li><Link to="/Notifications">Notifications</Link></li>
                
            </ul>
            <ul className="box">
            <li><Link to="/Users">Users</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Settings">Settings</Link></li>
            <li><Link to="/Logout">Logout</Link></li>
            </ul>
        </div>
    </div>
  
</footer>
  )
}
