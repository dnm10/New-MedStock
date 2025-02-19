import React from "react";
import styles from "./Notifications.module.css";

const Notifications = () => {
  return (
    <div className={styles.notificationsContainer}>
      <h1 className={styles.notificationsTitle}>Stock Notifications</h1>
      <div className={styles.notificationsList}>
        <div className={`${styles.notificationCard} ${styles.notificationCardLowStock}`}>
          <div className={styles.notificationCardHeader}>
            <span className={styles.notificationCardTitle}>Low stock alert for item A</span>
            <span className={styles.notificationCardTime}>2 hours ago</span>
          </div>
          <div className={styles.notificationCardBody}>
            <p>Item A is running low on stock, please restock soon.</p>
          </div>
        </div>

        <div className={`${styles.notificationCard} ${styles.notificationCardIncomingStock}`}>
          <div className={styles.notificationCardHeader}>
            <span className={styles.notificationCardTitle}>Stock arriving for item B tomorrow</span>
            <span className={styles.notificationCardTime}>5 hours ago</span>
          </div>
          <div className={styles.notificationCardBody}>
            <p>New stock of item B will arrive tomorrow. Prepare for restocking.</p>
          </div>
        </div>

        <div className={`${styles.notificationCard} ${styles.notificationCardOutOfStock}`}>
          <div className={styles.notificationCardHeader}>
            <span className={styles.notificationCardTitle}>Out of stock for item C</span>
            <span className={styles.notificationCardTime}>1 day ago</span>
          </div>
          <div className={styles.notificationCardBody}>
            <p>Item C is completely out of stock, please order more as soon as possible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;