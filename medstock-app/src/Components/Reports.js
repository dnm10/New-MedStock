import React, { useEffect, useState } from "react";
import { FaBox, FaChartLine, FaExclamationTriangle, FaTrashAlt, FaPrint } from "react-icons/fa";
import styles from "./Reports.module.css";

const Reports = () => {
  const [lowStockItems, setLowStockItems] = useState([]); // Stores low stock items
  const [showLowStock, setShowLowStock] = useState(false); // Controls modal visibility
  const [stockCounts, setStockCounts] = useState({
    totalItems: 0,
    totalStock: 0,
    lowStock: 0,
    expiredItems: 0,
  });

  useEffect(() => {
    const fetchStockCounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports/stock");
        const data = await response.json();

        setStockCounts({
          totalItems: data.totalItems,
          totalStock: data.totalStock,
          lowStock: data.lowStock,
          expiredItems: data.expiredItems,
        });
      } catch (error) {
        console.error("Error fetching stock counts:", error);
      }
    };

    fetchStockCounts();
  }, []);

  // ✅ Corrected: Now handleLowStockClick is placed properly inside the component
  const handleLowStockClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports/low-stock-items");
      const data = await response.json();

      console.log("Low Stock Data:", data); // Debugging log

      if (Array.isArray(data) && data.length > 0) {
        setLowStockItems(data);
      } else {
        setLowStockItems([]);
      }

      setShowLowStock(true); // Show modal
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    }
  };

  // Print Report Function
  const handlePrint = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    // Open a new print window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MedStock Inventory Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script> 
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f0f8ff; color: #0d47a1; text-align: center; }
          .report-container { max-width: 600px; margin: auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
          h2 { color: #1565c0; margin-bottom: 10px; }
          h3 { color: #0d47a1; margin-bottom: 10px; }
          .date-time { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background: #0d47a1; color: white; }
          td { font-size: 14px; font-weight: bold; }
          .chart-container { display: flex; justify-content: center; margin-top: 15px; }
          canvas { width: 220px !important; height: 220px !important; } /* Reduce Chart Size */
        </style>
      </head>
      <body>
        <div class="report-container">
          <h2>📄 MedStock Inventory Report</h2>
          <h3 class="date-time">${formattedDate} - ${formattedTime}</h3>
          <table>
            <tr>
              <th>Metric</th>
              <th>Count</th>
            </tr>
            <tr>
              <td>Total Items</td>
              <td>${stockCounts.totalItems}</td>
            </tr>
            <tr>
              <td>Current Stock</td>
              <td>${stockCounts.totalStock}</td>
            </tr>
            <tr>
              <td>Low Stock Alerts</td>
              <td>${stockCounts.lowStock}</td>
            </tr>
            <tr>
              <td>Expired Items</td>
              <td>${stockCounts.expiredItems}</td>
            </tr>
          </table>
  
          <!-- Smaller Doughnut Chart -->
          <div class="chart-container">
            <canvas id="stockChart"></canvas>
          </div>
        </div>
  
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            const ctx = document.getElementById("stockChart").getContext("2d");
            new Chart(ctx, {
              type: "doughnut",
              data: {
                labels: ["Total Items", "Current Stock", "Low Stock", "Expired Items"],
                datasets: [{
                  data: [${stockCounts.totalItems}, ${stockCounts.totalStock}, ${stockCounts.lowStock}, ${stockCounts.expiredItems}],
                  backgroundColor: ["#1976D2", "#4CAF50", "#FFC107", "#D32F2F"],
                  hoverOffset: 8
                }]
              },
              options: {
                responsive: false, /* Disable auto-resizing */
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: "bottom" }, 
                  datalabels: { 
                    color: "white", 
                    font: { weight: "bold" },
                    formatter: (value, ctx) => {
                      let total = ctx.chart.data.datasets[0].data.reduce((acc, cur) => acc + cur, 0);
                      let percentage = ((value / total) * 100).toFixed(1) + "%";
                      return value > 0 ? percentage : ""; // Hide labels for 0 values
                    }
                  }
                }
              },
              plugins: [ChartDataLabels]
            });
  
            setTimeout(() => window.print(), 800); // Wait for chart to render before printing
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };
  

  return (
    <div className={styles.reportsContainer}>
      <h1 className={styles.title}>Smart Inventory Solutions!</h1>
      <h2 className={styles.subtitle}>📊 MedStock Reports Overview</h2>

      {/* Overview Cards */}
      <div className={styles.overview}>
        <div className={styles.card}>
          <FaBox className={styles.icon} />
          <h3>Total Items</h3>
          <p>{stockCounts.totalItems}</p>
        </div>
        <div className={styles.card}>
          <FaChartLine className={styles.icon} />
          <h3>Current Stock</h3>
          <p>{stockCounts.totalStock}</p>
        </div>
        <div className={styles.card} onClick={handleLowStockClick}> {/* ✅ Clickable card */}
          <FaExclamationTriangle className={styles.icon} />
          <h3>Low Stock</h3>
          <p>{stockCounts.lowStock}</p>
        </div>
        <div className={styles.card}>
          <FaTrashAlt className={styles.icon} />
          <h3>Expired Items</h3>
          <p>{stockCounts.expiredItems}</p>
        </div>
      </div>

      {/* Print Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.printButton} onClick={handlePrint}>
          <FaPrint className={styles.printIcon} /> PRINT REPORT
        </button>
      </div>
            {/* Benefits of Smart Inventory Reports */}
            <h2 className={styles.subtitle}>🚀 Why Use Smart Inventory Reports?</h2>
      <div className={styles.benefitsContainer}>
        <div className={styles.card}>
          <h3>📦 Accurate Tracking</h3>
          <p>Monitor stock levels with precision, reducing waste and shortages.</p>
        </div>
        <div className={styles.card}>
          <h3>📡 Real-Time Updates</h3>
          <p>Get instant alerts on low stock, ensuring timely restocking.</p>
        </div>
        <div className={styles.card}>
          <h3>📊 Data-Driven Decisions</h3>
          <p>Analyze trends and optimize inventory management for better efficiency.</p>
        </div>
      </div>


      {/* Low Stock Items Modal */}
      {showLowStock && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Low Stock Items</h3>
            <ul>
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - <strong>{item.stock} left</strong>
                  </li>
                ))
              ) : (
                <p>No low stock items.</p>
              )}
            </ul>
            <button className={styles.closeButton} onClick={() => setShowLowStock(false)}>Close</button>
          </div>
        </div>
      )}
    </div>

    
  );
  
};

export default Reports;
