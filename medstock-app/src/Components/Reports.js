import React, { useEffect, useState } from 'react';
import styles from './Reports.module.css';

const Reports = () => {
  const [stockCounts, setStockCounts] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStock: 0,
    expiredItems: 0,
  });

  const [dateRange, setDateRange] = useState('daily');

  useEffect(() => {
    const fetchStockCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports/stock');
        const data = await response.json();

        setStockCounts({
          totalItems: data.totalItems,
          totalStock: data.totalStock,
          lowStock: data.lowStock,
          expiredItems: data.expiredItems,
        });
      } catch (error) {
        console.error('Error fetching stock counts:', error);
      }
    };

    fetchStockCounts();
  }, []);

  // Function to generate & print the report
  const handlePrint = () => {
    const reportContent = `
      <html>
      <head>
        <title>MedStock Inventory Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          p { font-size: 18px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>📄 MedStock Inventory Report</h2>
        <p>The total number of items in the inventory is <strong>${stockCounts.totalItems}</strong>.</p>
        <p>The current stock level is <strong>${stockCounts.totalStock}</strong> items.</p>
        <p>There are <strong>${stockCounts.lowStock}</strong> low stock alerts.</p>
        <p>The total number of expired items is <strong>${stockCounts.expiredItems}</strong>.</p>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.Reports}>
      <h1>Reports Overview</h1>

      {/* Overview Cards */}
      <div className={styles.Overview}>
        <div className={styles.Card}>
          <h3>Total Items</h3>
          <p>{stockCounts.totalItems}</p>
        </div>
        <div className={styles.Card}>
          <h3>Current Stock Levels</h3>
          <p>{stockCounts.totalStock}</p>
        </div>
        <div className={styles.Card}>
          <h3>Low Stock Alerts</h3>
          <p>{stockCounts.lowStock}</p>
        </div>
        <div className={styles.Card}>
          <h3>Expired Items</h3>
          <p>{stockCounts.expiredItems}</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className={styles.DateRangeSelector}>
        <label>Select Report Type:</label>
        <select onChange={(e) => setDateRange(e.target.value)} value={dateRange}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* 🚀 Print Button */}
      <div className={styles.ButtonContainer}>
        <button className={styles.PrintButton} onClick={handlePrint}>
          View & Print Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
