import React, { useState, useEffect } from "react";

import styles from './UserBilling.module.css';
import '../App.css';

const UserBilling = () => {
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0); 
  const [previousBills, setPreviousBills] = useState([]);
  const [paymentType, setPaymentType] = useState("cash"); 
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');



  const fetchBills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-bills");
      const data = await response.json();
      setPreviousBills(data);
    } catch (error) {
      console.error("Error fetching previous bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
    console.log("Previous Bills Fetched:", previousBills);
  }, [previousBills]);
  

    const getTodayTotal = () => {
      const today = new Date().toISOString().split("T")[0];
    
      const todayBills = previousBills.filter((bill) => {
        const billDate = bill.date?.split("T")[0]; // In case timestamp is included
        return billDate === today;
      });
    
      const total = todayBills.reduce((sum, bill) => {
        const amount = parseFloat(bill.totalAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    
      return total.toFixed(2);
    };
    
  
  

  const addToBill = async () => {
    if (name.trim() && quantity > 0 && price > 0) {
      const newItem = { name, quantity, price };

      try {
        const response = await fetch("http://localhost:5000/api/update-inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, quantity }),
        });

        const result = await response.json();

        if (response.ok) {
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
          body { font-family: 'Arial', sans-serif; background-color: #f8f9fa; color: #333; }
          .invoice-container { max-width: 700px; margin: 20px auto; padding: 20px; background: #fff; border: 3px solid #007BFF; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .invoice-header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007BFF; }
          .invoice-header h1 { color: #007BFF; font-size: 24px; }
          .invoice-details { margin-top: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border: 1px solid #ccc; text-align: center; }
          th { background-color: #007BFF; color: white; }
          tfoot td { font-weight: bold; }
          .invoice-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: rgba(0, 123, 255, 0.1); white-space: nowrap; z-index: -1; }
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
          <p><strong>Payment Mode:</strong> ${paymentType === 'cash' ? 'Offline - Cash' : 'Online - Razorpay'}</p>
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
                ${billItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>`).join('')}
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

    // Save to backend
    fetch("http://localhost:5000/api/save-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billItems,
        totalAmount,
        date: new Date().toISOString(),
        username: localStorage.getItem("username") || "Unknown"
       
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Bill saved successfully:", data);
        fetchBills();
        setBillItems([]);
        setTotalAmount(0);
      })
      .catch(error => {
        console.error("Error saving bill:", error);
        alert("Error saving bill.");
      });
  };

  useEffect(() => {
    fetchBills();
  }, []);
  
  useEffect(() => {
    console.log("Previous Bills Fetched:", previousBills);
  }, [previousBills]);
  
  const handleMockOnlinePayment = async () => {
    // Basic validation for card fields
    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill in all the card details.");
      return;
    }
  
    if (cardNumber.length !== 16) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
  
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: localStorage.getItem("username") || "Unknown",
          amount: totalAmount,
        }),
      });
  
      if (response.ok) {
        alert("Mock Online Payment Successful!");
        setShowPaymentForm(false); // Hide the payment form
        generateInvoice(); // Generate the invoice
      }
    } catch (error) {
      console.error("Mock payment error:", error);
      alert("Failed to process payment.");
    }
  };
  
  
  return (
    <div className={styles.Billinguser}>
      <h1>MedStock Billing System</h1>

      <div className={styles.billingMainuser}>
        <section className={styles.Billingformuser}>
          <h2>Add Medicine</h2>
          <form>
            <div className={styles.Billingforminputuser}>
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
            <div className={styles.Billingforminputuser}>
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
            <div className={styles.Billingforminputuser}>
              <label htmlFor="price">Price per Unit (₹):</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />
            </div>
            <button type="button" onClick={addToBill}>Add to Bill</button>
          </form>
        </section>

        <section className={styles.billingSummaryuser}>
          <h2>Bill Summary</h2>
          <table className={styles.billingTableuser}>
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

        {/*<h3>Billing History</h3>*/}

             {/* Payment Type Dropdown */}
             <div className={styles.paymentTypeContainer}>
  <label>Select Payment Type: </label>
  <select
    className={styles.paymentTypeSelect}
    value={paymentType}
    onChange={(e) => setPaymentType(e.target.value)}
  >
    <option value="cash">Offline - Cash</option>
    <option value="online">Online - Razorpay</option>
  </select>
</div>


          <h3>Today's Payout: ₹{getTodayTotal()}</h3>


          {previousBills.length === 0 ? (
            <p>No previous bills yet.</p>
          ) : (
            <ul>
              {previousBills.map((bill) => (
                <li key={bill.id}>
                  <strong>Date:</strong> {new Date(bill.date).toLocaleString()} <br />
                  <strong>Amount:</strong> ₹{bill.totalAmount.toFixed(2)} <br />
                  <strong>Items:</strong> {bill.billItems.length} items
                </li>
              ))}
            </ul>
          )}
 {paymentType === "online" ? (
  <>
    <button onClick={() => setShowPaymentForm(true)}>Pay Online</button>

    {/* Modal for Payment Form */}
    {showPaymentForm && (
      <div className={styles.paymentModal}>
        <div className={styles.modalContent}>
          <h2>Enter Card Details</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleMockOnlinePayment(); }}>
            <div>
              <label>Card Number:</label>
              <input 
                type="text" 
                value={cardNumber} 
                onChange={(e) => setCardNumber(e.target.value)} 
                maxLength="16" 
                placeholder="Enter 16-digit card number" 
                required 
              />
            </div>
            <div>
              <label>Expiry Date:</label>
              <input 
                type="text" 
                value={expiry} 
                onChange={(e) => setExpiry(e.target.value)} 
                placeholder="MM/YY" 
                required 
              />
            </div>
            <div>
              <label>CVV:</label>
              <input 
                type="text" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value)} 
                maxLength="3" 
                placeholder="CVV" 
                required 
              />
            </div>
            <button type="submit">Submit Payment</button>
            <button type="button" onClick={() => setShowPaymentForm(false)}>Cancel</button>
          </form>
        </div>
      </div>
    )}
  </>
) : (
  <button onClick={generateInvoice}>Generate Invoice</button>
)}




          
        </section>
      </div>

      <footer className={styles.billingFooteruser}>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};


export default UserBilling;
