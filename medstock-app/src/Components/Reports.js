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

    const generateReport = () => {
      if (!salesData.length && !lowStockItems.length) {
        alert("No report data available!");
        return;
      }
    
      const reportWindow = window.open('', '_blank', 'width=800,height=600');
      reportWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f9f9f9;
                color: #333;
              }
              .report-header {
                text-align: center;
                background-color: #007bff;
                color: white;
                padding: 10px;
                border-radius: 8px;
              }
              .report-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              .report-table th, .report-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .report-table th {
                background-color: #007bff;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="report-header">
              <h1>MedStock Report</h1>
              <p><strong>Report Type:</strong> ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
    
            <h2>Sales Data</h2>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity Sold</th>
                  <th>Price per Unit (₹)</th>
                  <th>Total Sales (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${salesData.length > 0 
                  ? salesData.map(sale => `
                    <tr>
                      <td>${sale.name}</td>
                      <td>${sale.quantity}</td>
                      <td>₹${sale.price.toFixed(2)}</td>
                      <td>₹${(sale.quantity * sale.price).toFixed(2)}</td>
                    </tr>
                  `).join('')
                  : `<tr><td colspan="4">No sales data available</td></tr>`}
              </tbody>
            </table>
    
            <h2>Low Stock Items</h2>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Stock Level</th>
                  <th>Low Stock Threshold</th>
                </tr>
              </thead>
              <tbody>
                ${lowStockItems.length > 0 
                  ? lowStockItems.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.stock}</td>
                      <td>${item.threshold}</td>
                    </tr>
                  `).join('')
                  : `<tr><td colspan="3">No low stock items</td></tr>`}
              </tbody>
            </table>
          </body>
        </html>
      `);
      reportWindow.document.close();
      reportWindow.print();
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

  const generateReport = () => {
    console.log("Sales Data:", salesData);
    console.log("Low Stock Items:", lowStockItems);
  
    // Ensure data is defined before checking length
    const validSalesData = Array.isArray(salesData) ? salesData : [];
    const validLowStockItems = Array.isArray(lowStockItems) ? lowStockItems : [];
  
    if (validSalesData.length === 0 && validLowStockItems.length === 0) {
      alert("No data available for the selected report type.");
      return;
    }
  
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>MedStock Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f0f8ff; color: #333; }
            .invoice-header { text-align: center; background-color: #b3d9ff; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
            .invoice-header h1 { color: #0066cc; }
            .invoice-details { margin-top: 20px; }
            .invoice-details table { width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #d0e7ff; }
            .invoice-details th, .invoice-details td { border: 1px solid #d0e7ff; padding: 8px; text-align: left; }
            .invoice-details th { background-color: #cce0ff; color: #333; }
            .invoice-details tr:nth-child(even) { background-color: #f7fbff; }
            .invoice-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: rgba(0, 0, 0, 0.1); pointer-events: none; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="watermark">MedStock</div>
            <div class="invoice-header">
              <h1>MedStock Report</h1>
              <p><strong>Report Type:</strong> ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Report</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
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
                  ${validSalesData.map(sale => `
                    <tr>
                      <td>${sale.name}</td>
                      <td>${sale.quantity}</td>
                      <td>₹${sale.price.toFixed(2)}</td>
                      <td>₹${(sale.quantity * sale.price).toFixed(2)}</td>
                    </tr>
                  `).join('')}
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
                  ${validLowStockItems.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.stock}</td>
                      <td>${item.threshold}</td>
                    </tr>
                  `).join('')}
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
  
      <div className={styles.Overview}>
        <div className={styles.Card}>Total Items: {stockCounts.totalItems}</div>
        <div className={styles.Card}>Current Stock Levels: {stockCounts.totalStock}</div>
        <div className={styles.Card}>Low Stock Alerts: {stockCounts.lowStock}</div>
        <div className={styles.Card}>Expired Items: {stockCounts.expiredItems}</div>
      </div>
  
      <div className={styles.DateRangeSelector}>
        <label>Select Report Type:</label>
        <select onChange={(e) => setDateRange(e.target.value)} value={dateRange}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
  
      {/* 🚀 ADD PRINT BUTTON HERE */}
      <div className={styles.ButtonContainer}>
        <button onClick={generateReport} className={styles.PrintButton}>
          View & Print Report
        </button>
      </div>
    </div>
  );
  
};

export default Reports;
