import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineShoppingCart, AiOutlineCheckCircle, AiOutlinePercentage } from 'react-icons/ai';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [newOrder, setNewOrder] = useState({
    OrderID: "",
    SupplierID: "",
    DeliveryDate: "",
    medicines: [{ id: 1, name: "", quantity: 1, price: 0 }],
  });

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle input change for order details
  const handleNewOrderChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  // Update a specific medicine's details
  const updateMedicine = (id, field, value) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: prevOrder.medicines.map((medicine) =>
        medicine.id === id ? { ...medicine, [field]: value } : medicine
      ),
    }));
  };

  // Remove a medicine row
  const removeMedicine = (id) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: prevOrder.medicines.filter((medicine) => medicine.id !== id),
    }));
  };

  // Add a new medicine row
  const addMedicine = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      medicines: [
        ...prevOrder.medicines,
        { id: Date.now(), name: "", quantity: 1, price: 0 },
      ],
    }));
  };

  // Calculate total price
  const calculateTotal = () => {
    return newOrder.medicines.reduce(
      (total, medicine) => total + medicine.quantity * medicine.price,
      0
    );
  };

  // Add new order
  const addOrder = async () => {
    const { OrderID, SupplierID, DeliveryDate, medicines } = newOrder;

    if (!OrderID || !SupplierID || !DeliveryDate || medicines.length === 0) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        OrderID,
        SupplierID: parseInt(SupplierID, 10),
        DeliveryDate,
        medicines,
      });

      fetchOrders();
      setIsAddModalOpen(false);
      setNewOrder({ OrderID: "", SupplierID: "", DeliveryDate: "", medicines: [{ id: 1, name: "", quantity: 1, price: 0 }] });
      alert("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order.");
    }
  };

  // Delete order
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

  // Update delivery status
  const handleCheckboxChange = async (orderId, delivered) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { Delivery_Status: delivered ? 1 : 0 });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId ? { ...order, Delivery_Status: delivered } : order
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
      <h1>Orders List</h1>

      <div className={styles.statsCards}>
      <div className={styles.card}><AiOutlineShoppingCart size={30} /><h3>Total Orders</h3><p>{totalOrders}</p></div>
        <div className={styles.card}><AiOutlineCheckCircle size={30} /><h3>Delivered Orders</h3><p>{deliveredOrders.length}</p></div>
        <div className={styles.card}><AiOutlinePercentage size={30} /><h3>Delivery Percentage</h3><p>{deliveredPercentage}%</p></div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.addOrderButton} onClick={() => setIsAddModalOpen(true)}>Add Order</button>
        <button className={styles.orderHistoryButton} onClick={() => setIsHistoryModalOpen(true)}>Order History</button>
      </div>

      {isAddModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setIsAddModalOpen(false)}>&times;</button>
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
            {newOrder.medicines.map((medicine, index) => (
           <div key={medicine.id} className={styles.medicineCard}>
           <input
             type="text"
             placeholder="Medicine Name"
             onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
             required
           />
           <input
             type="number"
             placeholder="Quantity"
             onChange={(e) => updateMedicine(medicine.id, "quantity", Number(e.target.value))}
             required
           />
           <input
             type="number"
             placeholder="Price"
             onChange={(e) => updateMedicine(medicine.id, "price", Number(e.target.value))}
             required
           />
           <button onClick={() => removeMedicine(medicine.id)}>❌</button>
         </div>
         
            ))}

            <button className={styles.addorderaddmedbtn} onClick={addMedicine}>+ Add Medicine</button>
            <h3>Total Price:Rs{calculateTotal().toFixed(2)}</h3>

            <button onClick={addOrder}>Save Order</button>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setIsHistoryModalOpen(false)}>&times;</button>
            <h1>Order History</h1>
            {deliveredOrders.length > 0 ? (
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Medicine Name</th>
                    <th>Quantity Ordered</th>
                    <th>Supplier ID</th>
                    <th>Price</th>
                    <th>Delivery Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredOrders.map((order) => (
                    <tr key={order.OrderID}>
                      <td>{order.OrderID}</td>
                      <td>{order.MedicineName}</td>
                      <td>{order.QuantityOrdered}</td>
                      <td>{order.SupplierID}</td>
                      <td>{order.Price}</td>
                      <td>{formatDate(order.DeliveryDate)}</td>
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
      <th>Medicine Name</th>
      <th>Quantity</th>
      <th>Supplier ID</th>
      <th>Price</th>
      <th>Delivery Date</th>
      <th>Delivered</th>
      <th>Remove</th> {/* New Column */}
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.OrderID}>
        <td>{order.OrderID}</td>
        <td>{order.MedicineName}</td>
        <td>{order.QuantityOrdered}</td>
        <td>{order.SupplierID}</td>
        <td>{order.Price}</td>
        <td>{formatDate(order.DeliveryDate)}</td>
        <td>
  <input
    type="checkbox"
    checked={order.Delivery_Status === true} // Ensure boolean comparison
    onChange={(e) => handleCheckboxChange(order.OrderID, e.target.checked)}
  />
</td>
        <td>
          <button
            className={styles.deleteButton}
            onClick={() => deleteOrder(order.OrderID)}
          >
            ❌ Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Orders;  