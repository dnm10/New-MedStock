import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import styles from "./AdminBilling.module.css";
import "../App.css";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
      const response = await api.get("/get-delivered-orders");
      setPendingOrders(response.data);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      setError("Failed to fetch delivered orders.");
    }
  };

  // ✅ Fetch previous billing history
  const fetchPreviousBills = async () => {
    try {
      const response = await api.get("/get-bills");
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
      const response = await api.post("/generate-bill", {
        orderID: order.OrderID,
      });
  
      if (response.status === 200) {
        toast.success("Bill generated successfully!");
        fetchDeliveredOrders(); // Refresh pending orders
        fetchPreviousBills();   // Refresh billing history
        viewInvoice(response.data.billID); // Show the invoice in modal
      }
    } catch (error) {
      console.error("Error generating bill:", error); // Log the entire error
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("Error generating bill. Please try again.");
      }
    }
  };
  

  // ✅ Fetch and view invoice
  const viewInvoice = async (billID) => {
    try {
      const response = await api.get(`/invoice/${billID}`);
      setSelectedBill(response.data.bill);
      setInvoiceItems(response.data.items);
      setShowInvoice(true);
    } catch (err) {
      toast.error("Unable to fetch invoice.");
    }
  };

  // ✅ Utility function to safely format price
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const generatePDFInvoice = () => {
    if (!selectedBill) return;
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("MedStock Admin Invoice", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text(`Bill ID: ${selectedBill.BillID}`, 15, 40);
    doc.text(`Order ID: ${selectedBill.OrderID}`, 15, 50);
    doc.text(`Date: ${new Date(selectedBill.BillingDate).toLocaleDateString()}`, 15, 60);

    const tableColumn = ["#", "Medicine", "Quantity", "Price (Rs)"];
    const tableRows = [];

    invoiceItems.forEach((item, idx) => {
      const rowData = [
        idx + 1,
        item.MedicineName,
        item.Quantity,
        Number(item.Price).toFixed(2)
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
    });

    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs ${Number(selectedBill.TotalAmount).toFixed(2)}`, 15, finalY + 15);

    doc.save(`invoice_${selectedBill.BillID}.pdf`);
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
            <div style={{ textAlign: "center", marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={generatePDFInvoice} style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Download PDF</button>
              <button onClick={() => setShowInvoice(false)} style={{ padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Close</button>
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
