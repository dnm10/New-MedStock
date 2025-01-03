import React from 'react'
import '../App.css';
import './footer.css';
export default function Footer() {
  return (
    <footer>
    <div className="content">
        <div className="top">
            <div className="logo-details">
              <img src="mslogoed.png" alt="logo"/>
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
                <li><a href="#">Inventory</a></li>
                <li><a href="#">Orders</a></li>
                <li><a href="#">Suppliers</a></li>
                <li><a href="#">Reports</a></li>
                <li><a href="#">Billing</a></li>
                <li><a href="#">Notifications</a></li>
                
            </ul>
            <ul className="box">
                <li><a href="#">Users</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </div>
    </div>
  
</footer>
  )
}
