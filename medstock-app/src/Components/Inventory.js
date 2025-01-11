import React, { useState } from 'react';
import styles from './Inventory.module.css';

export default function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Sample Item 1', category: 'Category A', quantity: 40, expiryDate: '2024-12-31', supplier: 'Supplier X' },
    { id: 2, name: 'Sample Item 2', category: 'Category B', quantity: 25, expiryDate: '2025-01-15', supplier: 'Supplier Y' },
    { id: 3, name: 'Sample Item 3', category: 'Category C', quantity: 60, expiryDate: '2024-11-30', supplier: 'Supplier Z' },
    { id: 4, name: 'Sample Item 4', category: 'Category D', quantity: 45, expiryDate: '2024-10-20', supplier: 'Supplier W' },
    { id: 5, name: 'Sample Item 5', category: 'Category R', quantity: 30, expiryDate: '2025-02-10', supplier: 'Supplier R' },
    { id: 6, name: 'Sample Item 6', category: 'Category T', quantity: 50, expiryDate: '2025-03-05', supplier: 'Supplier B' },
    { id: 7, name: 'Sample Item 7', category: 'Category H', quantity: 15, expiryDate: '2025-05-22', supplier: 'Supplier N' },
    { id: 8, name: 'Sample Item 8', category: 'Category A', quantity: 35, expiryDate: '2024-09-18', supplier: 'Supplier C' },
    { id: 9, name: 'Sample Item 9', category: 'Category F', quantity: 20, expiryDate: '2025-01-01', supplier: 'Supplier X' },
    { id: 10, name: 'Sample Item 10', category: 'Category N', quantity: 80, expiryDate: '2024-12-25', supplier: 'Supplier L' },
    { id: 11, name: 'Sample Item 11', category: 'Category E', quantity: 55, expiryDate: '2025-04-10', supplier: 'Supplier Z' },
    { id: 12, name: 'Sample Item 12', category: 'Category G', quantity: 70, expiryDate: '2024-11-05', supplier: 'Supplier W' },
  ]);

  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    expiryDate: '',
    supplier: '',
  });

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ name: '', category: '', quantity: '', expiryDate: '', supplier: '' });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewItem({ ...newItem, [id]: value });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();

    const newItemWithId = {
      ...newItem,
      id: inventory.length + 1,
      quantity: parseInt(newItem.quantity, 10),
    };

    const updatedInventory = [...inventory, newItemWithId];
    setInventory(updatedInventory);
    setFilteredInventory(updatedInventory);
    closeAddModal();
  };

  const handleSearch = () => {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const filteredItems = inventory.filter(item =>
      Object.values(item)
          .map(value => String(value).toLowerCase())
          .join(' ')
          .includes(query)
    );

    setFilteredInventory(filteredItems);
  };

  const handleSort = () => {
    const sortBy = document.getElementById('sortOptions').value;
    const sortedInventory = [...filteredInventory].sort((a, b) => {
      if (sortBy === 'quantity') {
        return a[sortBy] - b[sortBy];
      } else if (sortBy === 'expiryDate') {
        return new Date(a[sortBy]) - new Date(b[sortBy]);
      } else {
        return String(a[sortBy]).localeCompare(String(b[sortBy]));

      }
    });
    setFilteredInventory(sortedInventory);
  };

  return (
    <>
      <div className={styles.inventory}>
        <h1>Inventory Overview</h1>
        <div className={styles.controls}>
          <button id="addItemBtn" onClick={handleAddItem}>Add New Item</button>
          <button id="updateItemBtn">Update Item</button>
          <button id="removeItemBtn">Remove Item</button>
          <button id="reportBtn">Inventory Report</button>
        </div>

        <div className={styles.topRow}>
          <div className={styles.searchSort}>
            <input
              type="text"
              id="searchBox"
              placeholder="Search..."
              onChange={handleSearch}
            />
          </div>
          <div className={styles.sortOptions}>
            <label>Sort By: </label>
            <select id="sortOptions">
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="quantity">Quantity</option>
              <option value="expiryDate">Expiry Date</option>
              <option value="supplier">Supplier</option>
            </select>
            <button id="sortBtn" onClick={handleSort}>Sort</button>
          </div>
        </div>

        <table className="invent-table">
          <thead>
            <tr className="invent-header-row">
              <th className="invent-header">No.</th>
              <th className="invent-header">Item Name</th>
              <th className="invent-header">Category</th>
              <th className="invent-header">Quantity</th>
              <th className="invent-header">Expiry Date</th>
              <th className="invent-header">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.expiryDate}</td>
                <td>{item.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeBtn} onClick={closeAddModal}>&times;</span>
            <h2>Add New Item</h2>
            <form id="addItemForm" onSubmit={handleSaveItem}>
              <label htmlFor="name">Item Name:</label>
              <input
                type="text"
                id="name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              /><br />

              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                value={newItem.category}
                onChange={handleInputChange}
                required
              /><br />

              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              /><br />

              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="date"
                id="expiryDate"
                value={newItem.expiryDate}
                onChange={handleInputChange}
                required
              /><br />

              <label htmlFor="supplier">Supplier:</label>
              <input
                type="text"
                id="supplier"
                value={newItem.supplier}
                onChange={handleInputChange}
                required
              /><br />

              <button type="submit">Save Item</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}