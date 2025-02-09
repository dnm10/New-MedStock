import React from 'react';
import styles from '../Home/BenefitsSection.module.css';
import hp3 from '../../Assets/hp3.jpg';
import '../../App.css';

export default function BenefitsSection() {
  return (
    <section className={styles.third}>
      <div className={styles.thirdContent}>
        <div className={styles.benefits}>
          <h2>User Benefits:</h2>
        </div>
        <h3>
          <ul className={styles.points1}>
            <li>Simplified Stock Management: Automate inventory tracking.</li>
            <li>Stay Informed: Real-time notifications for expiring or low stock.</li>
            <li>Save Time: Reduce manual effort with automated updates and reports.</li>
          </ul>
        </h3>
      </div>
      <div className={styles.image3Box}>
        <img src={hp3} alt="User Benefits" className={styles.thirdImage} />
      </div>
    </section>
  );
}
