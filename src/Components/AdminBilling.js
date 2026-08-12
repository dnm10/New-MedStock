import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";


import toast from 'react-hot-toast';
import { AiOutlineClose } from "react-icons/ai";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminBilling = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [previousBills, setPreviousBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaySales, setTodaySales] = useState({ totalSales: 0, totalRevenue: 0, paymentBreakdown: [] });
  const [paymentMethods, setPaymentMethods] = useState({});

  const [selectedBill, setSelectedBill] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);



  // Fetch only delivered orders for billing
  const fetchDeliveredOrders = async () => {
    try {
      const response = await api.get("/get-delivered-orders");
      setPendingOrders(response.data);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      setError("Failed to fetch delivered orders.");
    }
  };

  // Fetch previous billing history
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

  // Fetch today's sales summary
  const fetchTodaySales = async () => {
    try {
      const response = await api.get("/sales/summary?range=today");
      setTodaySales(response.data);
    } catch (error) {
      console.error("Error fetching today sales:", error);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
    fetchPreviousBills();
    fetchTodaySales();
  }, []);

  // Generate a bill for an order
  const generateBill = async (order, paymentType) => {
    try {
      const response = await api.post("/generate-bill", {
        orderID: order.OrderID,
        paymentType: paymentType || 'Bank Transfer'
      });
  
      if (response.status === 200) {
        toast.success("Bill generated successfully!");
        fetchDeliveredOrders(); // Refresh pending orders
        fetchPreviousBills();   // Refresh billing history
        fetchTodaySales();      // Refresh sales summary
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
  

  // Fetch and view invoice
  const viewInvoice = async (billID) => {
    try {
      const response = await api.get(`/invoice/${billID}`);
      const billData = response.data.bill;
      if (response.data.businessDetails) {
        billData.businessDetails = response.data.businessDetails;
      }
      setSelectedBill(billData);
      setInvoiceItems(response.data.items);
      setShowInvoice(true);
    } catch (err) {
      toast.error("Unable to fetch invoice.");
    }
  };

  // Utility function to safely format price
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
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 px-5 md:px-8 mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">MedStock Billing System</h1>
      </div>

      {loading ? (
        <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400 font-medium text-lg animate-pulse">Loading billing data...</p></div>
      ) : error ? (
        <div className="max-w-7xl mx-auto bg-danger-bg text-danger border border-danger p-4 rounded-xl text-center font-medium mb-6">
          {error}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Pending Orders for Billing */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-100 dark:border-slate-700 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Pending Orders for Billing</h2>
            {pendingOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Total Price (₹)</th>
                      <th className="px-6 py-4">Delivery Date</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingOrders.map((order) => (
                      <tr key={order.OrderID} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.OrderID}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">₹{formatPrice(order.TotalPrice)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{new Date(order.DeliveryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <select
                              value={paymentMethods[order.OrderID] || 'Bank Transfer'}
                              onChange={(e) => setPaymentMethods({ ...paymentMethods, [order.OrderID]: e.target.value })}
                              className="px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm outline-none"
                            >
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cash">Cash</option>
                              <option value="Card">Card</option>
                            </select>
                            <button 
                              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                              onClick={() => generateBill(order, paymentMethods[order.OrderID] || 'Bank Transfer')}
                            >
                              Generate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                <p>No pending orders for billing.</p>
              </div>
            )}
          </section>

          {/* Billing History */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-100 dark:border-slate-700 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Billing History</h2>
            {previousBills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4">Bill ID</th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Total Amount (₹)</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previousBills.map((bill) => (
                      <tr key={bill.BillID} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{bill.BillID}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{bill.OrderID}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{new Date(bill.BillingDate).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">₹{formatPrice(bill.TotalAmount)}</td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900 hover:border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
                            onClick={() => viewInvoice(bill.BillID)}
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                <p>No previous bills found.</p>
              </div>
            )}
          </section>

        </div>
      )}

      {/* Today's Sales Summary Panel */}
      <div className="max-w-7xl mx-auto mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-100 dark:border-slate-700 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Today's Sales Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 dark:bg-slate-700 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Total Sales</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{todaySales.totalSales}</p>
          </div>
          <div className="bg-success-50 dark:bg-slate-700 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold text-success-600 dark:text-success-400">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">₹{Number(todaySales.totalRevenue).toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 dark:bg-slate-700 p-4 rounded-xl">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-300 text-center mb-2">Payment Breakdown</p>
            <ul className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
              {todaySales.paymentBreakdown && todaySales.paymentBreakdown.length > 0 ? (
                todaySales.paymentBreakdown.map((b, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{b.payment_method} ({b.count}):</span>
                    <span className="font-semibold">₹{Number(b.amount).toFixed(2)}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-slate-500">No sales yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded invoice modal */}
      {showInvoice && selectedBill && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-modal max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button 
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all" 
              onClick={() => setShowInvoice(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
              {/* Business Header */}
              {selectedBill.businessDetails && (
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{selectedBill.businessDetails.business_name}</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedBill.businessDetails.business_address}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contact: {selectedBill.businessDetails.business_contact} | GSTIN: {selectedBill.businessDetails.business_gstin}</p>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">Tax Invoice</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700 dark:text-slate-200">
                <p><strong className="text-slate-900">Bill ID:</strong> {selectedBill.BillID}</p>
                <p><strong className="text-slate-900">Order ID:</strong> {selectedBill.OrderID}</p>
                <p><strong className="text-slate-900">Date:</strong> {new Date(selectedBill.BillingDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-50 border-b border-primary-100 text-primary-900 text-sm">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Medicine</th>
                    <th className="px-4 py-3 font-semibold text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900">
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100 font-medium">{item.MedicineName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 text-center">{item.Quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100 text-right font-medium">{Number(item.Price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mb-8 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Total: <span className="text-primary-700">₹{Number(selectedBill.TotalAmount).toFixed(2)}</span></h3>
            </div>
            
            <div className="flex justify-end gap-4">
              <button 
                className="bg-slate-200 text-slate-700 dark:text-slate-200 hover:bg-slate-300 px-6 py-2.5 rounded-xl font-bold transition-colors"
                onClick={() => setShowInvoice(false)}
              >
                Close
              </button>
              <button 
                className="bg-success hover:bg-success-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all"
                onClick={generatePDFInvoice}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium border-t border-slate-200 dark:border-slate-700 pt-6">
        <p>&copy; 2025 MedStock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminBilling;
