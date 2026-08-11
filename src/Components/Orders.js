import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { AiOutlineShoppingCart, AiOutlineCheckCircle, AiOutlinePercentage, AiOutlineClose } from 'react-icons/ai';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [, setSuggestedMedicines] = useState([]);
  const [inventoryMedicines, setInventoryMedicines] = useState([]);
  const [newOrder, setNewOrder] = useState({
    OrderID: " ",
    SupplierID: " ",
    DeliveryDate: " ",
    medicines: [{ id: 1, name: " ", category: " ", quantity: 1, price: 0 }],
  });

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchInventoryMedicines = async () => {
    try {
      const response = await api.get("/inventory/names");
      setInventoryMedicines(response.data);
    } catch (err) {
      console.error("Error fetching inventory medicine names", err);
    }
  };

  const getSuggestedMedicines = async (openModal = false) => {
    try {
      const [lowResponse, inventoryResponse] = await Promise.all([
        api.get("/inventory/low-or-expired"),
        api.get("/inventory/names"),
      ]);
  
      const defaultMeds = lowResponse.data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity < 10 ? 10 - item.quantity : 1,
        price: item.price,
        supplier_id: item.supplier_id,
        expiryDate: item.expiryDate || "0000-00-00",
      }));
  
      const mergedMedicines = [
        ...defaultMeds,
        ...newOrder.medicines.filter((m) => !defaultMeds.some((s) => s.name === m.name)),
      ];
  
      setSuggestedMedicines(defaultMeds);
      setInventoryMedicines(inventoryResponse.data);
      setNewOrder((prev) => ({
        ...prev,
        medicines: mergedMedicines,
        SupplierID: defaultMeds.length > 0 ? defaultMeds[0].supplier_id : prev.SupplierID,
      }));
  
      if (openModal) setIsAddModalOpen(true);
    } catch (error) {
      console.error("Error fetching suggested medicines:", error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
    fetchInventoryMedicines();
    getSuggestedMedicines(false);
    const interval = setInterval(getSuggestedMedicines, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNewOrderChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const updateMedicine = (id, field, value) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: prevOrder.medicines.map((medicine) =>
        medicine.id === id ? { ...medicine, [field]: value } : medicine
      ),
    }));
  };

  const removeMedicine = (id) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: prevOrder.medicines.filter((medicine) => medicine.id !== id),
    }));
  };

  const addMedicine = () => {
    const uniqueId = Date.now();
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: [
        ...prevOrder.medicines,
        { id: uniqueId, name: "", category: "", quantity: 1, price: 0, expiryDate: "0000-00-00", supplier_id: prevOrder.SupplierID },
      ],
    }));
  };

  const calculateTotal = () => {
    return newOrder.medicines.reduce(
      (total, medicine) => total + medicine.quantity * medicine.price,
      0
    );
  };

  const addOrder = async () => {
    const { OrderID, SupplierID, DeliveryDate, medicines } = newOrder;
  
    if (!OrderID || !SupplierID || !DeliveryDate || medicines.length === 0) {
      toast.error("Please fill out all fields.");
      return;
    }
  
    for (const med of medicines) {
      if (!med.name || med.quantity <= 0 || med.price <= 0) {
        toast.error("Please provide valid medicine details.");
        return;
      }
    }
  
    try {
      const response = await api.post("/orders", {
        OrderID: OrderID.trim(),
        SupplierID: parseInt(SupplierID, 10),
        DeliveryDate,
        TotalPrice: calculateTotal(),
        medicines: medicines.map(({ name, category, quantity, price, expiryDate, supplier_id }) => ({
          name: name.trim(),
          category: category.trim(),
          quantity,
          price,
          expiryDate,
          supplier_id: supplier_id || SupplierID,
        })),
      });
  
      fetchOrders();
      setIsAddModalOpen(false);
      setNewOrder({
        OrderID: "",
        SupplierID: "",
        DeliveryDate: "",
        medicines: [{ id: 1, name: "", category: "", quantity: 1, price: 0 }],
      });
      toast.success("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to add order: " + (error.response?.data?.details || error.message));
    }
  };
    
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.OrderID !== orderId));
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  const handleCheckboxChange = async (orderId, delivered) => {
    try {
      const orderToUpdate = orders.find(order => order.OrderID === orderId);
      if (!orderToUpdate) throw new Error("Order not found");

      const response = await api.put(`/orders/${orderId}/deliver`, { delivered });

      if (response.status === 200) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.OrderID === orderId
              ? { ...order, Delivery_Status: delivered }
              : order
          )
        );

        if (delivered) {
          await updateInventoryAfterDelivery(orderId, orderToUpdate.Medicines);
          toast.success("Order marked as delivered and inventory updated!");
        } else {
          toast.success("Order status updated to pending");
        }
      }
    } catch (error) {
      console.error("Delivery error:", error.response?.data || error.message);
    }
  };

  const updateInventoryAfterDelivery = async (orderId, medicines) => {
    try {
      if (!medicines || medicines.length === 0) return;

      const updatePromises = medicines.map(medicine => {
        if (!medicine.id && !medicine.InventoryID) return Promise.resolve();
        const medId = medicine.id || medicine.InventoryID;
        return api.put(`/inventory/update/${medId}`, { quantity: medicine.quantity });
      });

      await Promise.all(updatePromises);
      fetchInventoryMedicines(); 
    } catch (error) {
      console.error("Inventory update error:", error);
      throw error; 
    }
  };

  const formatDate = (dateString) => dateString ? dateString.split("T")[0] : "";

  const deliveredOrders = orders.filter((order) => order.Delivery_Status);
  const totalOrders = orders.length;
  const deliveredPercentage = totalOrders === 0 ? 0 : ((deliveredOrders.length / totalOrders) * 100).toFixed(2);

  return (
    <div className="bg-slate-50 min-h-screen pb-10 px-5 md:px-8 mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">Orders List</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 max-w-7xl mx-auto">
        <div className="flex-1 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 shadow-card text-white relative overflow-hidden flex flex-col justify-center transform transition-all hover:-translate-y-1 hover:shadow-card-hover">
          <AiOutlineShoppingCart className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-[60px]" />
          <h3 className="text-base font-semibold opacity-90 mb-2 z-10">Total Orders</h3>
          <p className="text-3xl font-bold z-10">{totalOrders}</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-success to-success-hover rounded-xl p-6 shadow-card text-white relative overflow-hidden flex flex-col justify-center transform transition-all hover:-translate-y-1 hover:shadow-card-hover">
          <AiOutlineCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-[60px]" />
          <h3 className="text-base font-semibold opacity-90 mb-2 z-10">Delivered Orders</h3>
          <p className="text-3xl font-bold z-10">{deliveredOrders.length}</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-warning to-warning-hover rounded-xl p-6 shadow-card text-white relative overflow-hidden flex flex-col justify-center transform transition-all hover:-translate-y-1 hover:shadow-card-hover">
          <AiOutlinePercentage className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-[60px]" />
          <h3 className="text-base font-semibold opacity-90 mb-2 z-10">Delivery Percentage</h3>
          <p className="text-3xl font-bold z-10">{deliveredPercentage}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mb-6 max-w-7xl mx-auto">
        <button 
          className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-8 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2" 
          onClick={() => setIsHistoryModalOpen(true)}
        >
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Order History
        </button>
        <button 
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center gap-2" 
          onClick={() => getSuggestedMedicines(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add Order
        </button>
      </div>

      {/* Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 relative">
            <button 
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all" 
              onClick={() => setIsAddModalOpen(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Add New Order</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Order ID</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700 transition-shadow" type="text" name="OrderID" value={newOrder.OrderID} onChange={handleNewOrderChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier ID</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700 transition-shadow" type="text" name="SupplierID" value={newOrder.SupplierID || ''} onChange={handleNewOrderChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Date</label>
                <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700 transition-shadow" type="date" name="DeliveryDate" value={newOrder.DeliveryDate || ''} onChange={handleNewOrderChange} required />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Medicines</h3>
            {newOrder.medicines.map((medicine) => (
              <div key={medicine.id} className="flex flex-wrap gap-4 items-center p-4 border border-slate-200 rounded-xl mb-4 bg-white shadow-sm">
                <input className="flex-1 min-w-[120px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" type="text" list="medicineOptions" placeholder="Medicine Name" value={medicine.name} onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)} required />
                <datalist id="medicineOptions">
                  {inventoryMedicines.map((med) => (
                    <option key={med.id} value={med.name} />
                  ))}
                </datalist>
                <input className="flex-1 min-w-[120px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" type="text" list="categoryOptions" placeholder="Category" value={medicine.category} onChange={(e) => updateMedicine(medicine.id, "category", e.target.value)} required />
                <datalist id="categoryOptions">
                  {inventoryMedicines.map((med) => (
                    <option key={med.id} value={med.category} />
                  ))}
                </datalist>
                <input className="w-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" type="number" placeholder="Qty" value={medicine.quantity} onChange={(e) => updateMedicine(medicine.id, "quantity", Number(e.target.value))} required />
                <input className="w-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" type="number" placeholder="Price" value={medicine.price} onChange={(e) => updateMedicine(medicine.id, "price", Number(e.target.value))} required />
                <button className="bg-danger-bg text-danger border border-danger-bg hover:bg-danger hover:text-white px-3 py-2 rounded-lg font-semibold transition-colors" onClick={() => removeMedicine(medicine.id)}>❌</button>
              </div>
            ))}
            <button className="w-full bg-slate-50 text-primary-600 border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 py-3 rounded-xl font-semibold transition-colors mb-6" onClick={addMedicine}>
              + Add Medicine
            </button>
            <h3 className="text-xl font-bold text-slate-800 text-right mb-6">Total Price: ₹{calculateTotal().toFixed(2)}</h3>
            <button className="w-full bg-success hover:bg-success-hover text-white py-3.5 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" onClick={addOrder}>
              Save Order
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-5xl w-full max-h-[85vh] overflow-y-auto p-8 relative">
            <button 
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all" 
              onClick={() => setIsHistoryModalOpen(false)}
            >
               <AiOutlineClose size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center border-b border-slate-200 pb-4">Order History</h1>
            {deliveredOrders.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4 border-b border-slate-200">Order ID</th>
                      <th className="px-6 py-4 border-b border-slate-200">Medicines</th>
                      <th className="px-6 py-4 border-b border-slate-200">Supplier ID</th>
                      <th className="px-6 py-4 border-b border-slate-200">Total Price</th>
                      <th className="px-6 py-4 border-b border-slate-200">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {deliveredOrders.map((order) => (
                      <tr key={order.OrderID} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">{order.OrderID}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {Array.isArray(order.Medicines) && order.Medicines.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1">
                              {order.Medicines.map((med, index) => (
                                <li key={index}>
                                  {med.name} ({med.category}) - {med.quantity} units - ₹{med.price}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <em className="text-slate-400">No medicines</em>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{order.SupplierID}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{order.TotalPrice}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{order.DeliveryDate ? formatDate(order.DeliveryDate) : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <p className="text-slate-500 font-medium">No orders delivered till date.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Orders Table */}
      <div className="max-w-7xl mx-auto overflow-x-auto rounded-xl border border-slate-200 shadow-card bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-800 text-white text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Medicines</th>
              <th className="px-6 py-4">Supplier ID</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4">Delivery Date</th>
              <th className="px-6 py-4 text-center">Delivered</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.OrderID} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{order.OrderID}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {Array.isArray(order.Medicines) && order.Medicines.length > 0 ? (
                      <ul className="space-y-1">
                        {order.Medicines.map((med, index) => (
                          <li key={index}>
                            {med.name === 'Medicine Not Found' ? (
                              <span className="text-danger font-medium">Medicine details not found</span>
                            ) : (
                              `${med.name} (${med.category}) - ${med.quantity} units - ₹${med.price}`
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em className="text-slate-400">No medicines</em>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{order.SupplierID}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{order.TotalPrice}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{order.DeliveryDate ? formatDate(order.DeliveryDate) : "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-success"
                      checked={Boolean(order.Delivery_Status)}
                      onChange={(e) => handleCheckboxChange(order.OrderID, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="bg-danger-bg text-danger hover:bg-danger hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-danger-bg" 
                      onClick={() => deleteOrder(order.OrderID)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
