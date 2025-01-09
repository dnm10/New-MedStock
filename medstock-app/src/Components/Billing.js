import React, { useState } from 'react';
import styles from './Billing.module.css';
import '../App.css';


const Billing = () => {
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const addToBill = () => {
    if (name.trim() && quantity > 0 && price > 0) {
      const newItem = { name, quantity, price };
      const updatedItems = [...billItems, newItem];
      const updatedTotal = updatedItems.reduce((sum, curr) => sum + curr.quantity * curr.price, 0);

      setBillItems(updatedItems);
      setTotalAmount(updatedTotal);

      // Clear form
      setName('');
      setQuantity(1);
      setPrice(0);
    } else {
      alert('Please enter valid values for all fields.');
    }
  };

  const generateInvoice = () => {
    const billNumber = Math.floor(Math.random() * 1000000);
    const date = new Date();

    const invoiceWindow = window.open('', '_blank', 'width=600,height=400');
    invoiceWindow.document.write(`
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #007BFF; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }
          th { background-color: #007BFF; color: white; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <p>Bill No: ${billNumber}</p>
        <p>Date: ${date.toLocaleDateString()}</p>
        <p>Time: ${date.toLocaleTimeString()}</p>
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
            ${billItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h3>Total Amount: ₹${totalAmount.toFixed(2)}</h3>
      </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  return (
    <div className={styles.Billing}>
      <header>
        <h1>MedStock Billing System</h1>
      </header>

      <main>
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

        <section className="bill-summary">
          <h2>Bill Summary</h2>
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
          <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
          <button onClick={generateInvoice}>Generate Invoice</button>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Billing;
