import React, { useEffect, useState } from 'react';
import styles from './Reports.module.css';

const Reports = () => {
  const [stockCounts, setStockCounts] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStock: 0,
    expiredItems: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
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

    const fetchSalesData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reports/sales?range=${dateRange}`);
        const data = await response.json();
        setSalesData(data.sales);

        const lowStockResponse = await fetch('http://localhost:5000/api/reports/low-stock');
        const lowStockData = await lowStockResponse.json();
        setLowStockItems(lowStockData.items);
      } catch (error) {
        console.error('Error fetching sales or low stock data:', error);
      }
    };

    fetchStockCounts();
    fetchSalesData();
  }, [dateRange]);

  return (
    <div className={styles.Reports}>
      <h1>Reports Overview</h1>

      {/* 📌 NEW: Description Card */}
      <div className={styles.DescriptionCard}>
        <h2>📊 MedStock Reports</h2>
        <p>
          The MedStock Reports provide insights into **inventory levels, low stock alerts, expired products, and sales data**.
          Use the options below to generate detailed reports for daily or monthly analysis.
        </p>
      </div>

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
        <button className={styles.PrintButton}>View & Print Report</button>
      </div>
    </div>
  );
};

export default Reports;
