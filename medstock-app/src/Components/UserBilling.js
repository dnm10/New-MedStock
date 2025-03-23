import React, { useState, useEffect } from "react";
import styles from "./UserBilling.module.css";
import "../App.css";

const UserBilling = () => {
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [previousBills, setPreviousBills] = useState([]);
  const [inventory, setInventory] = useState([]); // Define inventory state


  // Fetch previous bills
  const fetchBills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-bills");
      const data = await response.json();
      console.log("Fetched Bills:", data);
      if (Array.isArray(data)) {
        setPreviousBills(data);
        updateTotalAmount(data);
      } else {
        setPreviousBills([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching previous bills:", error);
      setPreviousBills([]);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);


  useEffect(() => {
    fetchInventory(); // Call function to get updated inventory when component mounts
  }, []); // Runs only on component mount

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-inventory");
      const data = await response.json();
      setInventory(data); // Update state with latest inventory
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // Call fetchInventory again after updating inventory
  const updateInventory = async (medicineName, quantitySold) => {
    try {
      const response = await fetch("http://localhost:5000/api/update-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: medicineName, quantity: quantitySold }),
      });

      const result = await response.json();
      if (response.ok) {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item.name === medicineName ? { ...item, quantity: item.quantity - quantitySold } : item
          )
        );
        fetchInventory(); // Refresh inventory after successful update
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };
  
  // Function to update total amount
  const updateTotalAmount = (bills) => {
    const total = bills.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
    setTotalAmount(total);
  };

  
    const addToBill = async () => {
      if (name.trim() && quantity > 0 && price > 0) {
        const newItem = { name, quantity, price };
    
        try {
          const response = await fetch("http://localhost:5000/api/add-bill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
          });
    
          const result = await response.json();
          if (response.ok) {
            const updatedBills = [...billItems, newItem];
            setBillItems(updatedBills);
            updateTotalAmount(updatedBills);
    
            // Update Inventory Automatically
            await updateInventory(name, quantity);
    
            // Reset Input Fields
            setName("");
            setQuantity(0);
            setPrice(0);
    
            fetchBills(); // Refresh bills
          } else {
            alert(result.message || "Failed to add bill.");
          }
        } catch (error) {
          console.error("Error adding bill:", error);
          alert("Error connecting to server.");
        }
      } else {
        alert("Please enter valid values for all fields.");
      }
    };
    

  const clearBillData = async () => {
    try {
      await fetch("http://localhost:5000/api/clear-bills", { method: "DELETE" });
      setPreviousBills([]); // Reset state in frontend
      setTotalAmount(0);
    } catch (error) {
      console.error("Error clearing bills:", error);
    }
  };

  const generateInvoice = async () => {
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
              ${previousBills
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${parseFloat(item.price).toFixed(2)}</td>
                  <td>₹${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total Amount</td>
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

    // Clear the bill after invoice generation
    await clearBillData();
  };

  return (
    <div className={styles.Billinguser}>
      <h1>MedStock Billing System</h1>
      <div className={styles.billingMainuser}>
        <section className={styles.billinguserform}>
          <h2>Add Medicine</h2>
          <form>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Medicine Name" />
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} />
            <input type="number" value={price} onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))} />
            <button type="button" onClick={addToBill}>Add to Bill</button>
          </form>
        </section>
        <section className={styles.billinguserSummary}>
          <h2>Bill Summary</h2>
          {previousBills.length > 0 ? (
            <table className={styles.billTable}>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity</th>
                  <th>Price (₹)</th>
                  <th>Total Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {previousBills.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.name}</td>
                    <td>{bill.quantity}</td>
                    <td>₹{parseFloat(bill.price).toFixed(2)}</td>
                    <td>₹{(bill.quantity * parseFloat(bill.price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No previous bills found.</p>
          )}
          <p><strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong></p>
          <button onClick={generateInvoice}>Generate Invoice</button>
        </section>
        <section className={styles.inventorySection}>
  <h2>Available Inventory</h2>
  <table>
    <thead>
      <tr>
        <th>Medicine</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      {inventory.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

      </div>
    </div>
  );
};

export default UserBilling;
