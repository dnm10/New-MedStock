import React from 'react';
import styles from '../Home/Footer.module.css';
import '../../App.css';
import mslogoed from '../../Assets/mslogoed.png';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.logoDetails}>
            <img src={mslogoed} alt="MedStock Logo" className={styles.logoImage} />
            <span className={styles.logoName}>MedStock</span>
          </div>
        </div>

        <div className={styles.linkBoxes}>
          <ul className={styles.box}>
            <li><Link to="/Home">Home</Link></li>
            <li><Link to="/Contact">Contact Us</Link></li>
            <li><Link to="/About">About Us</Link></li>
            <li><Link to="/Start">Get Started</Link></li>
          </ul>

          <ul className={styles.box}>
            <li><Link to="/Inventory">Inventory</Link></li>
            <li><Link to="/Orders">Orders</Link></li>
            <li><Link to="/Supplier">Suppliers</Link></li>
            <li><Link to="/Reports">Reports</Link></li>
            <li><Link to="/Billing">Billing</Link></li>
            <li><Link to="/Notifications">Notifications</Link></li>
          </ul>

          <ul className={styles.box}>
            <li><Link to="/Users">Users</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Settings">Settings</Link></li>
            <li><Link to="/Logout">Logout</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
