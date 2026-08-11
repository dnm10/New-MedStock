import React, { useState, useEffect } from "react";
import styles from './UserBilling.module.css';
import '../App.css';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const UserBilling = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0); 
  const [previousBills, setPreviousBills] = useState([]);
  const [paymentType, setPaymentType] = useState("cash"); 
  const [todayTotal, setTodayTotal] = useState("0.00");

  useEffect(() => {
    fetchInventory();
    fetchBills();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data);
    } catch (error) {
      toast.error("Failed to load inventory");
    }
  };

  const fetchBills = async () => {
    try {
      const response = await api.get("/get-bills");
      setPreviousBills(response.data);
      updateTodayTotal(response.data); 
    } catch (error) {
      console.error("Error fetching previous bills:", error);
    }
  };

  const updateTodayTotal = (bills) => {
    const today = new Date().toISOString().split("T")[0];
    const currentUser = localStorage.getItem("username");
    const todayBills = bills.filter((bill) => {
      const billDate = bill.date?.split("T")[0];
      return billDate === today && bill.username === currentUser;
    });
    const total = todayBills.reduce((sum, bill) => {
      const amount = parseFloat(bill.totalAmount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    setTodayTotal(total.toFixed(2));
  };

  const handleMedicineSelect = (e) => {
    const medName = e.target.value;
    setSelectedMedicine(medName);
    const med = inventory.find(i => i.name === medName);
    if (med) setPrice(med.price || 0);
  };

  const addToBill = () => {
    if (!selectedMedicine || quantity <= 0 || price <= 0) {
      toast.error("Please enter valid values for all fields.");
      return;
    }
    const med = inventory.find(i => i.name === selectedMedicine);
    if (!med) {
      toast.error("Medicine not found in inventory.");
      return;
    }
    if (quantity > med.quantity) {
      toast.error(`Only ${med.quantity} units available in stock.`);
      return;
    }

    const newItem = { name: selectedMedicine, quantity, price };
    const updatedItems = [...billItems, newItem];
    const updatedTotal = updatedItems.reduce((sum, curr) => sum + curr.quantity * curr.price, 0);

    setBillItems(updatedItems);
    setTotalAmount(updatedTotal);
    setSelectedMedicine("");
    setQuantity(1);
    setPrice(0);
  };

  const handlePayment = async () => {
    if (billItems.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    if (paymentType === 'cash' || paymentType === 'upi') {
      await finalizeBill(paymentType === 'upi' ? 'Online - UPI' : 'Offline - Cash');
    } else if (paymentType === 'online') {
      try {
        const orderRes = await api.post('/create-order', { amount: totalAmount });
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'dummy_key',
          amount: orderRes.data.amount,
          currency: "INR",
          name: "MedStock",
          description: "Pharmacy Bill Payment",
          order_id: orderRes.data.id,
          handler: async function (response) {
            try {
              await api.post('/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success("Payment successful!");
              await finalizeBill('Online - Razorpay');
            } catch (err) {
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: { color: "#0ea5e9" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error("Failed to initialize payment");
      }
    }
  };

  const finalizeBill = async (paymentModeStr) => {
    try {


      const billRes = await api.post("/save-bill", {
        billItems,
        totalAmount,
        date: new Date().toISOString(),
        username: localStorage.getItem("username") || "Unknown",
        paymentType: paymentModeStr
      });

      toast.success("Bill finalized and saved!");
      generatePDFInvoice(billRes.data.billId || Math.floor(Math.random() * 1000), paymentModeStr);
      
      setBillItems([]);
      setTotalAmount(0);
      fetchBills();
      fetchInventory();
    } catch (error) {
      toast.error("Error finalizing bill.");
    }
  };

  const generatePDFInvoice = (billId, paymentModeStr) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("MedStock Invoice", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text(`Bill No: ${billId}`, 15, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 50);
    doc.text(`Payment Mode: ${paymentModeStr}`, 15, 60);

    const tableColumn = ["Medicine", "Quantity", "Price (Rs)", "Total (Rs)"];
    const tableRows = [];

    billItems.forEach(item => {
      const rowData = [
        item.name,
        item.quantity,
        Number(item.price).toFixed(2),
        (item.quantity * item.price).toFixed(2)
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
    doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`, 15, finalY + 15);

    doc.save(`invoice_${billId}.pdf`);
  };

  return (
    <div className={styles.Billinguser}>
      <h1 className="text-3xl font-bold mb-6 text-primary-600">MedStock Walk-in Billing</h1>

      <div className={styles.billingMainuser}>
        <section className={styles.Billingformuser}>
          <h2 className="text-xl font-semibold mb-4">Add Medicine</h2>
          <form>
            <div className={styles.Billingforminputuser}>
              <label>Medicine Name:</label>
              <select value={selectedMedicine} onChange={handleMedicineSelect} required className="w-full p-2 border rounded">
                <option value="">-- Select Medicine --</option>
                {inventory.map(med => (
                  <option key={med.id} value={med.name}>{med.name} (Stock: {med.quantity})</option>
                ))}
              </select>
            </div>
            <div className={styles.Billingforminputuser}>
              <label>Quantity:</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} min="1" required className="w-full p-2 border rounded" />
            </div>
            <div className={styles.Billingforminputuser}>
              <label>Price per Unit (₹):</label>
              <input type="number" value={price} disabled className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <button type="button" onClick={addToBill} className="w-full bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition">Add to Bill</button>
          </form>
        </section>

        <section className={styles.billingSummaryuser}>
          <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
          <table className={styles.billingTableuser}>
            <thead>
              <tr className="bg-primary-100">
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price (₹)</th>
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

          <div className={styles.paymentTypeContainer}>
            <label className="font-semibold">Payment Type: </label>
            <select className={styles.paymentTypeSelect + " border p-2 rounded ml-2"} value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="cash">Offline - Cash</option>
              <option value="online">Online - Razorpay</option>
              <option value="upi">Online - UPI</option>
            </select>
          </div>

          <h3 className="text-lg font-bold text-gray-700 mb-4 mt-4">Cart Total: ₹{totalAmount.toFixed(2)}</h3>
          
          <button onClick={handlePayment} className="w-full bg-secondary-500 text-white p-3 rounded font-bold hover:bg-secondary-600 transition">
            Finalize & Pay
          </button>
          
          <div className="mt-8">
            <h3 className="font-semibold text-gray-600">Today's Payout: ₹{todayTotal}</h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserBilling;
