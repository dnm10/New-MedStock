import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineShoppingCart, AiOutlineCheckCircle, AiOutlinePercentage } from 'react-icons/ai';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [suggestedMedicines, setSuggestedMedicines] = useState([]);
  const [inventoryMedicines, setInventoryMedicines] = useState([]);
  const [newOrder, setNewOrder] = useState({
    OrderID: "",
    SupplierID: "",
    DeliveryDate: "",
    medicines: [{ id: 1, name: "", category: "", quantity: 1, price: 0 }],
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchInventoryMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/inventory/names");
      setInventoryMedicines(response.data);
    } catch (err) {
      console.error("Error fetching inventory medicine names", err);
    }
  };

  const fetchLowOrExpiredMedicines = async () => {
    try {
      const [lowResponse, inventoryResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/inventory/low-or-expired"),
        axios.get("http://localhost:5000/api/inventory/names"),
      ]);

      const defaultMeds = lowResponse.data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity < 10 ? 10 - item.quantity : 1,
        price: item.price,
        supplier_id: item.supplier_id,
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
      setIsAddModalOpen(true);
    } catch (error) {
      console.error("Error fetching suggested medicines:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchInventoryMedicines();
    fetchLowOrExpiredMedicines();
    const interval = setInterval(fetchLowOrExpiredMedicines, 30000);
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
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: [
        ...prevOrder.medicines,
        { id: null, name: "", category: "", quantity: 1, price: 0 },
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
    console.log(newOrder); // Log the current state of newOrder to debug
    
    const { OrderID, SupplierID, DeliveryDate, medicines } = newOrder;
    
    if (!OrderID || !SupplierID || !DeliveryDate || medicines.length === 0) {
      alert("Please fill out all fields.");
      return;
    }

    // Validate each medicine
    for (const med of medicines) {
      if (!med.name || med.quantity <= 0 || med.price <= 0) {
        alert("Please provide valid medicine details.");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        OrderID: OrderID.trim(),
        SupplierID: parseInt(SupplierID, 10),
        DeliveryDate,
        TotalPrice: calculateTotal(),
        medicines: medicines.map(({ name, category, quantity, price }) => ({
          name: name.trim(),
          category: category.trim(),
          quantity,
          price
        }))
      });

      fetchOrders();
      setIsAddModalOpen(false);
      setNewOrder({ OrderID: "", SupplierID: "", DeliveryDate: "", medicines: [{ id: 1, name: "", category: "", quantity: 1, price: 0 }] });
      alert("✅ Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
      alert("❌ Failed to add order: " + (error.response?.data?.details || error.message));
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.OrderID !== orderId));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  const handleCheckboxChange = async (orderId, delivered) => {
    try {
      const deliveryDate = delivered ? new Date().toISOString().split('T')[0] : null;

      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        Delivery_Status: delivered ? 1 : 0,
        DeliveryDate: deliveryDate
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId
            ? { ...order, Delivery_Status: delivered, DeliveryDate: deliveryDate }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const formatDate = (dateString) => dateString ? dateString.split("T")[0] : "";

  const deliveredOrders = orders.filter((order) => order.Delivery_Status);
  const totalOrders = orders.length;
  const deliveredPercentage = totalOrders === 0 ? 0 : ((deliveredOrders.length / totalOrders) * 100).toFixed(2);

  return (
    <div className={styles.Orders}>
      <h1 className={styles.ordersmainheading}>Orders List</h1>

      <div className={styles.ordersstatsCards}>
        <div className={styles.orderscard}><AiOutlineShoppingCart size={30} /><h3>Total Orders</h3><p>{totalOrders}</p></div>
        <div className={styles.orderscard}><AiOutlineCheckCircle size={30} /><h3>Delivered Orders</h3><p>{deliveredOrders.length}</p></div>
        <div className={styles.orderscard}><AiOutlinePercentage size={30} /><h3>Delivery Percentage</h3><p>{deliveredPercentage}%</p></div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.addOrderButton} onClick={fetchLowOrExpiredMedicines}>Add Order</button>
        <button className={styles.orderHistoryButton} onClick={() => setIsHistoryModalOpen(true)}>Order History</button>
      </div>

      {isAddModalOpen && (
        <div className={styles.ordersmodal}>
          <div className={styles.ordersmodalContent}>
            <button className={styles.orderscloseButton} onClick={() => setIsAddModalOpen(false)}>&times;</button>
            <h3>Add New Order</h3>
            <label>Order ID:
              <input type="text" name="OrderID" value={newOrder.OrderID} onChange={handleNewOrderChange} required />
            </label>
            <label>Supplier ID:
              <input type="text" name="SupplierID" value={newOrder.SupplierID} onChange={handleNewOrderChange} required />
            </label>
            <label>Delivery Date:
              <input type="date" name="DeliveryDate" value={newOrder.DeliveryDate} onChange={handleNewOrderChange} required />
            </label>
            <h3>Medicines</h3>
            {newOrder.medicines.map((medicine) => (
              <div key={medicine.id} className={styles.ordersmedicineCard}>
                <input type="text" list="medicineOptions" placeholder="Medicine Name" value={medicine.name} onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)} required />
                <datalist id="medicineOptions">
                  {inventoryMedicines.map((med) => (
                    <option key={med.id} value={med.name} />
                  ))}
                </datalist>
                <input type="text" list="categoryOptions" placeholder="Category" value={medicine.category} onChange={(e) => updateMedicine(medicine.id, "category", e.target.value)} required />
                <datalist id="categoryOptions">
                  {inventoryMedicines.map((med) => (
                    <option key={med.id} value={med.category} />
                  ))}
                </datalist>
                <input type="number" placeholder="Quantity" value={medicine.quantity} onChange={(e) => updateMedicine(medicine.id, "quantity", Number(e.target.value))} required />
                <input type="number" placeholder="Price" value={medicine.price} onChange={(e) => updateMedicine(medicine.id, "price", Number(e.target.value))} required />
                <button onClick={() => removeMedicine(medicine.id)}>❌</button>
              </div>
            ))}
            <button className={styles.addorderaddmedbtn} onClick={addMedicine}>+ Add Medicine</button>
            <h3>Total Price: Rs{calculateTotal().toFixed(2)}</h3>
            <button onClick={addOrder}>Save Order</button>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className={styles.ordersmodal}>
          <div className={styles.ordersmodalContent}>
            <button className={styles.orderscloseButton} onClick={() => setIsHistoryModalOpen(false)}>&times;</button>
            <h1>Order History</h1>
            {deliveredOrders.length > 0 ? (
              <table className={styles.ordershistoryTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Medicines</th>
                    <th>Supplier ID</th>
                    <th>Total Price</th>
                    <th>Delivery Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredOrders.map((order) => (
                    <tr key={order.OrderID}>
                      <td>{order.OrderID}</td>
                      <td>
                        {Array.isArray(order.Medicines) && order.Medicines.length > 0 ? (
                          order.Medicines.map((med, index) => (
                            <div key={index}>
                              {med.name} ({med.category}) - {med.quantity} units - ₹{med.price}
                            </div>
                          ))
                        ) : (
                          <em>No medicines</em>
                        )}
                      </td>
                      <td>{order.SupplierID}</td>
                      <td>₹{order.TotalPrice}</td>
                      <td>{order.DeliveryDate ? formatDate(order.DeliveryDate) : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders delivered till date.</p>
            )}
          </div>
        </div>
      )}

      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Medicines</th>
            <th>Supplier ID</th>
            <th>Total Price</th>
            <th>Delivery Date</th>
            <th>Delivered</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.OrderID}>
                <td>{order.OrderID}</td>
                <td>
                  {Array.isArray(order.Medicines) && order.Medicines.length > 0 ? (
                    order.Medicines.map((med, index) => (
                      <div key={index}>
                        {med.name} - {med.quantity} units - ₹{med.price}
                      </div>
                    ))
                  ) : (
                    <em>No medicines</em>
                  )}
                </td>
                <td>{order.SupplierID}</td>
                <td>₹{order.TotalPrice}</td>
                <td>{order.DeliveryDate ? formatDate(order.DeliveryDate) : "N/A"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={Boolean(order.Delivery_Status)}
                    onChange={(e) => handleCheckboxChange(order.OrderID, e.target.checked)}
                  />
                </td>
                <td>
                  <button className={styles.deleteButton} onClick={() => deleteOrder(order.OrderID)}>
                    ❌ Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
