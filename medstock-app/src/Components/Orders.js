import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineShoppingCart, AiOutlineCheckCircle, AiOutlinePercentage } from 'react-icons/ai';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [newOrder, setNewOrder] = useState({
    OrderID: '',
    MedicineName: '',
    QuantityOrdered: '',
    SupplierID: '',
    Price: '',
    DeliveryDate: '',
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

  // Handle input change for new orders
  const handleNewOrderChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.split('T')[0] : '';
  };

  // Add new order
  const addOrder = async () => {
    const { OrderID, MedicineName, QuantityOrdered, SupplierID, Price, DeliveryDate } = newOrder;
  
    if (!OrderID || !MedicineName || !QuantityOrdered || !SupplierID || !Price || !DeliveryDate) {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        OrderID,
        MedicineName,
        QuantityOrdered: parseInt(QuantityOrdered, 10),  // Ensure number type
        SupplierID: parseInt(SupplierID, 10),  // Ensure number type
        Price: parseFloat(Price),  // Ensure decimal type
        DeliveryDate,
      });
  
      fetchOrders(); // Refresh the table after adding
      setIsAddModalOpen(false);
      setNewOrder({ OrderID: '', MedicineName: '', QuantityOrdered: '', SupplierID: '', Price: '', DeliveryDate: '' });
      alert("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error.response ? error.response.data : error);
      alert("Failed to add order.");
    }
  };
  

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
  
      if (response.data.success) {
        // Update state by filtering out the deleted order
        setOrders((prevOrders) => prevOrders.filter(order => order.OrderID !== orderId));
        alert("Order deleted successfully!");
      } else {
        alert("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please check the console for details.");
    }
  };  

  // Update delivery status
  const handleCheckboxChange = async (orderId, delivered) => {
    try {
      // Ensure we're sending a boolean value
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { Delivery_Status: delivered ? 1 : 0 });
  
      // Update the state after a successful update
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
  

  const deliveredOrders = orders.filter(order => order.Delivery_Status);
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
            <label>Order ID:<input type="text" name="OrderID" value={newOrder.OrderID} onChange={handleNewOrderChange} /></label>
            <label>Medicine Name: <input type="text" name="MedicineName" value={newOrder.MedicineName} onChange={handleNewOrderChange} /></label>
            <label>Quantity: <input type="number" name="QuantityOrdered" value={newOrder.QuantityOrdered} onChange={handleNewOrderChange} /></label>
            <label>Supplier ID: <input type="text" name="SupplierID" value={newOrder.SupplierID} onChange={handleNewOrderChange} /></label>
            <label>Price: <input type="number" name="Price" value={newOrder.Price} onChange={handleNewOrderChange} /></label>
            <label>Delivery Date: <input type="date" name="DeliveryDate" value={newOrder.DeliveryDate} onChange={handleNewOrderChange} /></label>
            <button className={styles.saveOrderButton} onClick={addOrder}>Save Order</button>
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
              <p>No orders delivered yet.</p>
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
            <th>Remove</th>
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
              <td><input type="checkbox" checked={order.Delivery_Status} onChange={(e) => handleCheckboxChange(order.OrderID, e.target.checked)} /></td>
              <td><button className={styles.deleteButton} onClick={() => deleteOrder(order.OrderID)}>❌ Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
