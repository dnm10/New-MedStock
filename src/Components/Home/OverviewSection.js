import React from 'react';
import styles from './OverviewSection.module.css';
import '../../App.css';
import hp2 from '../../Assets/hp2.jpg';

export default function OverviewSection() {
  return (
    <section className={styles.first}>
      <div className={styles.firstContent}>
        <div className={styles.capabilities}>
          <h2>Overview of System Capabilities:</h2>
        </div>
        <h3>
          <ul className={styles.points}>
            <li>Inventory Management: Track stock levels, manage expiries, and keep medicines up to date.</li>
            <li>Order Tracking: Simplified system to reorder supplies and check their status.</li>
            <li>Notifications & Alerts: Get alerts for low stock or expiring items to take timely action.</li>
            <li>Reporting Tools: View detailed reports on your inventory and sales trends.</li>
          </ul>
        </h3>
      </div>
      <div className={styles.image1Box}>
        <img src={hp2} alt="System Overview" className={styles.firstImage} />
      </div>
    </section>
  );
}
