import React, { useEffect, useState } from 'react';
import styles from './Reports.module.css';

const Reports = () => {
  const [stockCounts, setStockCounts] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStock: 0,
    expiredItems: 0,
  });

  useEffect(() => {
    // Fetch counts from the backend API
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/reports/stock'); // Adjust the API endpoint
        const data = await response.json();

        setStockCounts({
          totalItems: data.totalItems,
          totalStock: data.totalStock,
          lowStock: data.lowStock,
          expiredItems: data.expiredItems,
        });
      } catch (error) {
        console.error('Error fetching stock reports:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className={styles.Reports}>
        <h1>Reports Overview</h1>

      {/* Overview Cards */}
      <div className={styles.Overview}>
        <div className={styles.Card}>Total Items: {stockCounts.totalItems}</div>
        <div className={styles.Card}>Current Stock Levels: {stockCounts.totalStock}</div>
        <div className={styles.Card}>Low Stock Alerts: {stockCounts.lowStock}</div>
        <div className={styles.Card}>Expired Items: {stockCounts.expiredItems}</div>
      </div>
    </div>
  );
};

export default Reports;
