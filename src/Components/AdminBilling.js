import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminBilling.module.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

const AdminBilling = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [previousBills, setPreviousBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBill, setSelectedBill] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  const navigate = useNavigate();

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
        fetchPreviousBills();   // Refresh billing history
        viewInvoice(response.data.billID); // Show the invoice in modal
      }
    } catch (error) {
      console.error("Error generating bill:", error); // Log the entire error
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error generating bill. Please try again.");
      }
    }
  };
  

  // ✅ Fetch and view invoice
  const viewInvoice = async (billID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoice/${billID}`);
      setSelectedBill(response.data.bill);
      setInvoiceItems(response.data.items);
      setShowInvoice(true);
    } catch (err) {
      alert("Unable to fetch invoice.");
    }
  };

  // ✅ Utility function to safely format price
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  return (
    <div className={styles.Billingadmin}>
      <h1>MedStock Billing System</h1>

      {loading ? <p>Loading...</p> : error && <p className="error">{error}</p>}

      {/* ✅ Display pending delivered orders for billing */}
      <section className={styles.billingMainadmin}>
        <h2>Pending Orders for Billing</h2>
        {pendingOrders.length > 0 ? (
          <table className={styles.billingTableadmin}>
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
      <section className={styles.billingHistoryadmin}>
        <h2>Billing History</h2>
        {previousBills.length > 0 ? (
          <ul>
            {previousBills.map((bill) => (
              <li key={bill.BillID}>
                <strong>Bill ID:</strong> {bill.BillID} <br />
                <strong>Order ID:</strong> {bill.OrderID} <br />
                <strong>Date:</strong> {new Date(bill.BillingDate).toLocaleString()} <br />
                <strong>Total Amount:</strong> ₹{formatPrice(bill.TotalAmount)} <br />
                <button onClick={() => viewInvoice(bill.BillID)}>View Invoice</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous bills found.</p>
        )}
      </section>

      {/* ✅ Embedded invoice modal */}
      {showInvoice && selectedBill && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "10px", maxWidth: "700px", width: "90%",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <h2 style={{ textAlign: "center" }}>Invoice</h2>
            <p><strong>Bill ID:</strong> {selectedBill.BillID}</p>
            <p><strong>Order ID:</strong> {selectedBill.OrderID}</p>
            <p><strong>Date:</strong> {new Date(selectedBill.BillingDate).toLocaleString()}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.MedicineName}</td>
                    <td>{item.Quantity}</td>
                    <td>{Number(item.Price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: "1rem" }}>Total: ₹{Number(selectedBill.TotalAmount).toFixed(2)}</h3>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button onClick={() => setShowInvoice(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.billingfooteradmin}>
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminBilling;
