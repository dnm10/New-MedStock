import React from 'react';
import styles from '../Home/HeroSection.module.css';
import hp1 from '../../Assets/hp1.jpg'; 

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.content}>
        <h2>Manage Your Medical Inventory with Ease</h2>
        <h3>
          "Monitor stock levels, manage orders, track expiry dates, analyze inventory trends, 
          streamline workflows, and stay updated with real-time notifications."
        </h3>
      </div>
      <div className={styles.heroBox}>
        <img src={hp1} alt="hero" className={styles.heroImage} />
      </div>
    </section>
  );
}

export default HeroSection;
