import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminBilling.module.css";
import "../App.css";

const Billing = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [previousBills, setPreviousBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch only delivered orders for billing
  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-delivered-orders");
      setPendingOrders(response.data);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      setError("Failed to fetch delivered orders.");
    }
  };

  // ✅ Fetch previous billing history
  const fetchPreviousBills = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-bills");
      setPreviousBills(response.data);
    } catch (error) {
      console.error("Error fetching previous bills:", error);
      setError("Failed to fetch previous bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
    fetchPreviousBills();
  }, []);

  // ✅ Generate a bill for an order
  const generateBill = async (order) => {
    try {
      const response = await axios.post("http://localhost:5000/api/generate-bill", {
        orderID: order.OrderID,
      });

      if (response.status === 200) {
        alert("Bill generated successfully!");
        fetchDeliveredOrders(); // Refresh pending orders
        fetchPreviousBills(); // Refresh billing history
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Error generating bill. Please try again.");
    }
  };

  // ✅ Utility function to safely format price
  const formatPrice = (price) => {
    const numPrice = Number(price); // Convert to number
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  return (
    <div className={styles.Billing}>
      <h1>MedStock Billing System</h1>

      {loading ? <p>Loading...</p> : error && <p className="error">{error}</p>}

      {/* ✅ Display pending delivered orders for billing */}
      <section className={styles.billingMain}>
        <h2>Pending Orders for Billing</h2>
        {pendingOrders.length > 0 ? (
          <table className={styles.billingTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Price (₹)</th>
                <th>Delivery Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td>₹{formatPrice(order.TotalPrice)}</td>
                  <td>{new Date(order.DeliveryDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => generateBill(order)}>Generate Bill</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending orders for billing.</p>
        )}
      </section>

      {/* ✅ Display previous billing history */}
      <section className={styles.billingHistory}>
        <h2>Billing History</h2>
        {previousBills.length > 0 ? (
          <ul>
            {previousBills.map((bill) => (
              <li key={bill.BillID}>
                <strong>Bill ID:</strong> {bill.BillID} <br />
                <strong>Order ID:</strong> {bill.OrderID} <br />
                <strong>Date:</strong> {new Date(bill.BillingDate).toLocaleString()} <br />
                <strong>Total Amount:</strong> ₹{formatPrice(bill.TotalAmount)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous bills found.</p>
        )}
      </section>
      <footer className={styles.billingfooter}>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default Billing;
