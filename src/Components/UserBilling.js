import React, { useState, useEffect } from "react";

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
  const [paymentType, setPaymentType] = useState("cash"); 
  const [todayTotal, setTodayTotal] = useState("0.00");

  useEffect(() => {
    fetchInventory();
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      generatePDFInvoice(
        billRes.data.billId || Math.floor(Math.random() * 1000), 
        paymentModeStr, 
        billRes.data.businessDetails, 
        billRes.data.totalAmount
      );
      
      setBillItems([]);
      setTotalAmount(0);
      fetchBills();
      fetchInventory();
    } catch (error) {
      toast.error("Error finalizing bill.");
    }
  };

  const generatePDFInvoice = (billId, paymentModeStr, businessDetails, finalTotal) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    
    if (businessDetails && businessDetails.business_name) {
      doc.text(businessDetails.business_name, 105, 20, null, null, "center");
      doc.setFontSize(10);
      doc.text(businessDetails.business_address || '', 105, 28, null, null, "center");
      doc.text(`Contact: ${businessDetails.business_contact || ''} | GSTIN: ${businessDetails.business_gstin || ''}`, 105, 34, null, null, "center");
    } else {
      doc.text("MedStock Invoice", 105, 20, null, null, "center");
    }
    
    doc.setFontSize(12);
    doc.text(`Bill No: ${billId}`, 15, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 55);
    doc.text(`Payment Mode: ${paymentModeStr}`, 15, 65);

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
      startY: 75,
    });

    const finalY = doc.lastAutoTable.finalY || 75;
    doc.setFontSize(14);
    
    if (finalTotal && finalTotal !== totalAmount) {
      doc.text(`Subtotal: Rs ${totalAmount.toFixed(2)}`, 15, finalY + 10);
      doc.text(`Total Amount (incl. Tax): Rs ${finalTotal.toFixed(2)}`, 15, finalY + 20);
    } else {
      doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`, 15, finalY + 15);
    }

    doc.save(`invoice_${billId}.pdf`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 px-5 md:px-8 mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">Walk-in Billing</h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form */}
        <div className="flex-1 lg:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-100 dark:border-slate-700 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Add Medicine to Bill</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Medicine Name:</label>
              <select 
                value={selectedMedicine} 
                onChange={handleMedicineSelect} 
                required 
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 transition-all shadow-sm hover:border-slate-400"
              >
                <option value="">-- Select Medicine --</option>
                {inventory.map(med => (
                  <option key={med.id} value={med.name}>{med.name} (Stock: {med.quantity})</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Quantity:</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))} 
                  min="1" 
                  required 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 transition-all shadow-sm hover:border-slate-400" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Price per Unit (₹):</label>
                <input 
                  type="number" 
                  value={price} 
                  disabled 
                  className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-50 cursor-not-allowed" 
                />
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={addToBill} 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all mt-4"
            >
              Add to Bill
            </button>
          </form>
        </div>

        {/* Right Column: Summary */}
        <div className="flex-1 lg:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-100 dark:border-slate-700 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bill Summary</h2>
            <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold border border-primary-200">
              Today's Payout: ₹{todayTotal}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto mb-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            {billItems.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price (₹)</th>
                    <th className="px-4 py-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billItems.map((item, index) => (
                    <tr key={index} className="hover:bg-white dark:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 text-right">₹{Number(item.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full min-h-[150px] flex items-center justify-center text-slate-400 font-medium text-sm">
                No items added to bill yet.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Payment Type:</span>
              <select 
                value={paymentType} 
                onChange={(e) => setPaymentType(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 transition-all font-medium cursor-pointer hover:border-slate-400"
              >
                <option value="cash">Offline - Cash</option>
                <option value="online">Online - Razorpay</option>
                <option value="upi">Online - UPI</option>
              </select>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-4 mb-2">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Cart Total:</span>
              <span className="text-3xl font-bold text-primary-700">₹{totalAmount.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={billItems.length === 0}
              className={`w-full px-6 py-4 rounded-xl font-bold shadow-md transition-all text-lg
                ${billItems.length === 0 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-success hover:bg-success-hover text-white hover:-translate-y-0.5 hover:shadow-lg"
                }
              `}
            >
              Finalize & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBilling;
