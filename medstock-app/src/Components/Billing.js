import React, { useState } from 'react';
import styles from './Billing.module.css';

import '../App.css';


const Billing = () => {
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [previousBills, setPreviousBills] = useState([]);


  const addToBill = async () => {
    if (name.trim() && quantity > 0 && price > 0) {
      const newItem = { name, quantity, price };
  
      try {
        // Update inventory first
        const response = await fetch("http://localhost:5000/api/update-inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, quantity }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Only add item to bill if inventory update is successful
          const updatedItems = [...billItems, newItem];
          const updatedTotal = updatedItems.reduce((sum, curr) => sum + curr.quantity * curr.price, 0);
  
          setBillItems(updatedItems);
          setTotalAmount(updatedTotal);
          setName('');
          setQuantity(1);
          setPrice(0);
        } else {
          alert(result.message || "Failed to update inventory.");
        }
      } catch (error) {
        console.error("Error updating inventory:", error);
        alert("Error connecting to server.");
      }
    } else {
      alert("Please enter valid values for all fields.");
    }
  };
  
  

  const generateInvoice = () => {
    const billNumber = Math.floor(Math.random() * 1000);
    const date = new Date();
  
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
       
        <style>
          /* General Styles */
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
          }
          .invoice-container {
            max-width: 700px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border: 3px solid #007BFF; /* Main Border */
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          .invoice-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #007BFF; /* Separator Border */
          }
          .invoice-header h1 {
            color: #007BFF;
            margin: 0;
            font-size: 24px;
          }
          .invoice-header p {
            margin: 5px 0;
            font-size: 14px;
          }
          .invoice-details {
            margin-top: 20px;
            font-size: 14px;
          }
          .invoice-details p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: center;
          }
          th {
            background-color: #007BFF;
            color: white;
          }
          tfoot td {
            font-weight: bold;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
  
          /* Watermark Styles */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            color: rgba(0, 123, 255, 0.1); /* Light transparent blue */
            white-space: nowrap;
            z-index: -1; /* Behind content */
          }
  
          /* Print-Specific Styles */
          @media print {
            body {
              background-color: white;
            }
            .invoice-container {
              border: none;
              box-shadow: none;
            }
            th {
              background-color: #007BFF !important;
              -webkit-print-color-adjust: exact; /* Ensures accurate color printing */
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="watermark">MedStock</div>
          <div class="invoice-header">
            <h1>MedStock Invoice</h1>
            <p><strong>Bill No:</strong> ${billNumber}</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${date.toLocaleTimeString()}</p>
          </div>
          <div class="invoice-details">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Price per Unit (₹)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${billItems
                  .map(
                    (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.price.toFixed(2)}</td>
                      <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `
                  )
                  .join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Total Amount</td>
                  <td>₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
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

    // Save the bill to the database
  fetch("http://localhost:5000/api/save-bill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ billItems, totalAmount, date }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Bill saved successfully:", data);
      // Clear the bill after saving
      setBillItems([]);
      setTotalAmount(0);
    })
    .catch(error => console.error("Error saving bill:", error));
    
  };
  

  return (
    <div className={styles.Billing}>
      <h1>MedStock Billing System</h1>
  
      {/* Replaced billingmain with a div */}
      <div className={styles.billingMain}>
        <section className="billing-form">
          <h2>Add Medicine</h2>
          <form>
            <div className="input-group">
              <label htmlFor="medicine-name">Medicine Name:</label>
              <input
                type="text"
                id="medicine-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter medicine name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="price">Price per Unit (₹):</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
            <button type="button" onClick={addToBill}>Add to Bill</button>
          </form>
        </section>
  
        <section className={styles.billingSummary}>
          <h2>Bill Summary</h2>
          <table className={styles.billingTable}>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Price per Unit (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generateInvoice}>Generate Invoice</button>
        </section>
      </div>
  
      <footer>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
  
};

export default Billing;
