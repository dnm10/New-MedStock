import React, { useState } from 'react';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([
    { orderId: 'ORD001', medicineName: 'Paracetamol', quantity: 100, supplierName: 'Supplier A', price: 5000, orderDate: '2025-01-05', delivered: false },
    { orderId: 'ORD002', medicineName: 'Ibuprofen', quantity: 200, supplierName: 'Supplier B', price: 12000, orderDate: '2025-01-07', delivered: false },
    { orderId: 'ORD003', medicineName: 'Amoxicillin', quantity: 150, supplierName: 'Supplier C', price: 9750, orderDate: '2025-01-06', delivered: false },
    { orderId: 'ORD004', medicineName: 'Ciprofloxacin', quantity: 250, supplierName: 'Supplier D', price: 20000, orderDate: '2025-01-08', delivered: false },
    { orderId: 'ORD005', medicineName: 'Metformin', quantity: 300, supplierName: 'Supplier E', price: 21000, orderDate: '2025-01-09', delivered: false },
    { orderId: 'ORD006', medicineName: 'Aspirin', quantity: 120, supplierName: 'Supplier F', price: 7200, orderDate: '2025-01-10', delivered: false },
    { orderId: 'ORD007', medicineName: 'Atorvastatin', quantity: 220, supplierName: 'Supplier G', price: 17600, orderDate: '2025-01-11', delivered: false },
    { orderId: 'ORD008', medicineName: 'Omeprazole', quantity: 190, supplierName: 'Supplier H', price: 13300, orderDate: '2025-01-12', delivered: false },
    { orderId: 'ORD009', medicineName: 'Losartan', quantity: 170, supplierName: 'Supplier I', price: 11900, orderDate: '2025-01-13', delivered: false},
    { orderId: 'ORD010', medicineName: 'Clopidogrel', quantity: 140, supplierName: 'Supplier J', price: 9800, orderDate: '2025-01-14', delivered: false },
    { orderId: 'ORD011', medicineName: 'Pantoprazole', quantity: 180, supplierName: 'Supplier K', price: 12600, orderDate: '2025-01-15', delivered: false },
    { orderId: 'ORD012', medicineName: 'Cetirizine', quantity: 160, supplierName: 'Supplier L', price: 11200, orderDate: '2025-01-16', delivered: false },
    { orderId: 'ORD013', medicineName: 'Azithromycin', quantity: 210, supplierName: 'Supplier M', price: 16800, orderDate: '2025-01-17', delivered: false },
    { orderId: 'ORD014', medicineName: 'Levothyroxine', quantity: 130, supplierName: 'Supplier N', price: 8450, orderDate: '2025-01-18', delivered: false },
    { orderId: 'ORD015', medicineName: 'Salbutamol', quantity: 270, supplierName: 'Supplier O', price: 24300, orderDate: '2025-01-19', delivered: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    medicineName: '',
    quantity: '',
    supplierName: '',
    price: '',
    orderDate: '',
    delivered: false,
  });

  const handleCheckboxChange = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].delivered = !updatedOrders[index].delivered;
    setOrders(updatedOrders);
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === 'quantity' || name === 'price' ? parseInt(value) || '' : value,
    }));
  };

  const addOrder = () => {
    if (
      newOrder.orderId &&
      newOrder.medicineName &&
      newOrder.quantity &&
      newOrder.supplierName &&
      newOrder.price &&
      newOrder.orderDate
    ) {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setIsModalOpen(false);
      setNewOrder({
        orderId: '',
        medicineName: '',
        quantity: '',
        supplierName: '',
        price: '',
        orderDate: '',
        delivered: false,
      });
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className={styles.Orders}>
      <h1>Orders List</h1>
      <button className={styles.addOrderButton} onClick={() => setIsModalOpen(true)}>
        Add New Order
      </button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h3>Add New Order</h3>
            <label>
              Order ID:
              <input
                type="text"
                name="orderId"
                value={newOrder.orderId}
                onChange={handleNewOrderChange}
              />
            </label>
            <label>
              Medicine Name:
              <input
                type="text"
                name="medicineName"
                value={newOrder.medicineName}
                onChange={handleNewOrderChange}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={newOrder.quantity}
                onChange={handleNewOrderChange}
              />
            </label>
            <label>
              Supplier Name:
              <input
                type="text"
                name="supplierName"
                value={newOrder.supplierName}
                onChange={handleNewOrderChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={newOrder.price}
                onChange={handleNewOrderChange}
              />
            </label>
            <label>
              Order Date:
              <input
                type="date"
                name="orderDate"
                value={newOrder.orderDate}
                onChange={handleNewOrderChange}
              />
            </label>
            <button className={styles.saveOrderButton} onClick={addOrder}>
              Save Order
            </button>
          </div>
        </div>
      )}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Medicine Name</th>
            <th>Quantity Ordered</th>
            <th>Supplier Name</th>
            <th>Price</th>
            <th>Order Receiving Date</th>
            <th>Delivered</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.medicineName}</td>
              <td>{order.quantity}</td>
              <td>{order.supplierName}</td>
              <td>{order.price.toLocaleString()}</td>
              <td>{order.orderDate}</td>
              <td>
                <input
                  type="checkbox"
                  className={`custom-checkbox ${order.delivered ? 'checked' : ''}`}
                  checked={order.delivered}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
