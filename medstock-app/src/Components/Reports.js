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
  const [dateRange, setDateRange] = useState('daily'); // daily or monthly
  const [showReport, setShowReport] = useState(false);

  // Sample data for sales and stock items
  const billItems = [
    { name: 'Medicine A', quantity: 10, price: 50 },
    { name: 'Medicine B', quantity: 5, price: 30 },
  ];
  const billNumber = '12345';
  const date = new Date();
  const totalAmount = billItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  useEffect(() => {
    // Fetch stock counts from the backend API
    const fetchStockCounts = async () => {
      try {
        const response = await fetch('/api/reports/stock'); // Adjust API endpoint
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

    // Fetch sales and low stock items based on date range
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`/api/reports/sales?range=${dateRange}`); // Adjust API endpoint
        const data = await response.json();
        setSalesData(data.sales); // Assuming the response contains sales data

        const lowStockResponse = await fetch('/api/reports/low-stock'); // Fetch low stock products
        const lowStockData = await lowStockResponse.json();
        setLowStockItems(lowStockData.items); // Assuming the response contains low stock items
      } catch (error) {
        console.error('Error fetching sales or low stock data:', error);
      }
    };

    fetchStockCounts();
    fetchSalesData();
  }, [dateRange]);

  // Function to generate the report
  // Function to generate the report with light bluish color
const generateReport = () => {
  const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
  invoiceWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f0f8ff; /* Light blue background */
            color: #333; /* Dark text color for contrast */
          }
          .invoice-header {
            text-align: center;
            background-color: #b3d9ff; /* Light blue header background */
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .invoice-header h1 {
            color: #0066cc; /* Blue color for title */
          }
          .invoice-details {
            margin-top: 20px;
          }
          .invoice-details table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff; /* White background for the table */
            border: 1px solid #d0e7ff; /* Light blue border */
          }
          .invoice-details th, .invoice-details td {
            border: 1px solid #d0e7ff;
            padding: 8px;
            text-align: left;
          }
          .invoice-details th {
            background-color: #cce0ff; /* Light blue header row */
            color: #333; /* Dark text for table headers */
          }
          .invoice-details tr:nth-child(even) {
            background-color: #f7fbff; /* Very light blue rows for alternating colors */
          }
          .invoice-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: rgba(0, 0, 0, 0.1);
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="watermark">MedStock</div>
          <div class="invoice-header">
            <h1>MedStock Report</h1>
            <p><strong>Report Type:</strong> ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Report</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
          </div>
          <div class="invoice-details">
            <h2>Sales Data</h2>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity Sold</th>
                  <th>Price per Unit (₹)</th>
                  <th>Total Sales (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${salesData
                  .map(
                    (sale) => `
                    <tr>
                      <td>${sale.name}</td>
                      <td>${sale.quantity}</td>
                      <td>₹${sale.price.toFixed(2)}</td>
                      <td>₹${(sale.quantity * sale.price).toFixed(2)}</td>
                    </tr>
                  `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="invoice-details">
            <h2>Low Stock Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Stock Level</th>
                  <th>Low Stock Threshold</th>
                </tr>
              </thead>
              <tbody>
                ${lowStockItems
                  .map(
                    (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.stock}</td>
                      <td>${item.threshold}</td>
                    </tr>
                  `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="invoice-footer">
            <p>&copy; 2025 MedStock. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `);
  invoiceWindow.document.close();
  invoiceWindow.print();
};


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

      {/* Date Range Selection */}
      <div className={styles.DateRangeSelector}>
        <label>Select Report Type:</label>
        <select onChange={(e) => setDateRange(e.target.value)} value={dateRange}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Buttons for generating and viewing reports */}
      <div className={styles.ReportActions}>
        <button onClick={generateReport}>Generate Report</button>
       
      </div>

     
    </div>
  );
};

export default Reports;
