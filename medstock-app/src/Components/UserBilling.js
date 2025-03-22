import React, { useState, useEffect } from "react";
import styles from "./UserBilling.module.css";
import "../App.css";

const UserBilling = () => {
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [previousBills, setPreviousBills] = useState([]); // Stores billing history

  // Fetch previous bills
  const fetchBills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-bills");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPreviousBills(data); // Ensure data is an array
      } else {
        setPreviousBills([]);
      }
    } catch (error) {
      console.error("Error fetching previous bills:", error);
      setPreviousBills([]);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const addToBill = async () => {
    if (name.trim() && quantity > 0 && price > 0) {
      const newItem = { name, quantity, price };
  
      try {
        const response = await fetch("http://localhost:5000/api/update-inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, quantity }),
        });
  
        const text = await response.text(); // Read as text first
        console.log("Server Response:", text);
  
        try {
          const result = JSON.parse(text); // Convert to JSON safely
          if (response.ok) {
            setBillItems([...billItems, newItem]);
            setTotalAmount((prevTotal) => prevTotal + quantity * price);
            setName("");
            setQuantity(1);
            setPrice(0);
          } else {
            alert(result.message || "Failed to update inventory.");
          }
        } catch (jsonError) {
          alert("Server returned an invalid response. Check console.");
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

    const invoiceWindow = window.open("", "_blank", "width=800,height=600");
    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f8f9fa; color: #333; }
          .invoice-container { max-width: 700px; margin: 20px auto; padding: 20px; background: #fff; border: 3px solid #007BFF; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .invoice-header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007BFF; }
          .invoice-header h1 { color: #007BFF; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border: 1px solid #ccc; text-align: center; }
          th { background-color: #007BFF; color: white; }
          tfoot td { font-weight: bold; }
          .invoice-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>MedStock Invoice</h1>
            <p><strong>Bill No:</strong> ${billNumber}</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${date.toLocaleTimeString()}</p>
          </div>
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
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total Amount</td>
                <td>₹${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
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
    <div className={styles.Billinguser}>
      <h1>MedStock Billing System</h1>

      <div className={styles.billingMainuser}>
        <section className={styles.billinguserform}>
          <h2>Add Medicine</h2>
          <form>
            <div className={styles.Billinguserinputgroup}>
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
            <div className={styles.Billinguserinputgroup}>
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                required
              />
            </div>
            <div className={styles.Billinguserinputgroup}>
              <label htmlFor="price">Price per Unit (₹):</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                step="0.01"
                required
              />
            </div>
            <button type="button" onClick={addToBill}>
              Add to Bill
            </button>
          </form>
        </section>

        <section className={styles.billinguserSummary}>
          <h2>Bill Summary</h2>
          <ul>
            {previousBills.length > 0 ? (
              previousBills.map((bill) => (
                <div key={bill.id}>
                  <p>{bill.name}</p>
                </div>
              ))
            ) : (
              <p>No previous bills available.</p>
            )}
          </ul>
          <button onClick={generateInvoice}>Generate Invoice</button>
        </section>
      </div>

      <footer className={styles.billinguserFooter}>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default UserBilling;
