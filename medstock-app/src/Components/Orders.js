import React, { useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD001',
      medicineName: 'Paracetamol',
      quantity: 100,
      supplierName: 'Supplier A',
      price: 50,
      orderDate: '2025-01-05',
      delivered: false,
    },
    {
      orderId: 'ORD002',
      medicineName: 'Ibuprofen',
      quantity: 200,
      supplierName: 'Supplier B',
      price: 30,
      orderDate: '2025-01-07',
      delivered: true,
    },
    // Add more orders here
  ]);

  const handleCheckboxChange = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].delivered = !updatedOrders[index].delivered;
    setOrders(updatedOrders);
  };

  return (
    <div className="orders-container">
      <h2>Orders List</h2>
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
              <td>{order.price}</td>
              <td>{order.orderDate}</td>
              <td>
                <input
                  type="checkbox"
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
