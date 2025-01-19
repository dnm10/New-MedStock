import React, { useState } from 'react';
import styles from './Inventory.module.css';
import '../App.css';

export default function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Sample item 1', category: 'Category A', quantity: 40, expiryDate: '2024-12-31', supplier: 'Supplier X' },
    { id: 2, name: 'Sample Item 2', category: 'Category B', quantity: 25, expiryDate: '2025-01-15', supplier: 'Supplier Y' },
    { id: 3, name: 'Sample Item 3', category: 'Category C', quantity: 60, expiryDate: '2024-11-30', supplier: 'Supplier Z' },
    { id: 4, name: 'Sample Item 4', category: 'Category D', quantity: 45, expiryDate: '2024-10-20', supplier: 'Supplier W' },
    { id: 5, name: 'Sample Item 5', category: 'Category R', quantity: 30, expiryDate: '2025-02-10', supplier: 'Supplier R' },
    { id: 6, name: 'Sample Item 6', category: 'Category T', quantity: 15, expiryDate: '2025-03-05', supplier: 'Supplier B' },
    { id: 7, name: 'Sample Item 7', category: 'Category H', quantity: 15, expiryDate: '2025-05-22', supplier: 'Supplier N' },
    { id: 8, name: 'Sample Item 8', category: 'Category A', quantity: 35, expiryDate: '2024-09-18', supplier: 'Supplier C' },
    { id: 9, name: 'Sample Item 9', category: 'Category F', quantity: 20, expiryDate: '2025-01-01', supplier: 'Supplier X' },
    { id: 10, name: 'Sample Item 10', category: 'Category N', quantity: 80, expiryDate: '2024-12-25', supplier: 'Supplier L' },
    { id: 11, name: 'Sample Item 11', category: 'Category E', quantity: 55, expiryDate: '2025-04-10', supplier: 'Supplier Z' },
    { id: 12, name: 'Sample Item 12', category: 'Category G', quantity: 70, expiryDate: '2024-11-05', supplier: 'Supplier W' },
  ]);

  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    expiryDate: '',
    supplier: '',
  });

  const [selectedItem, setSelectedItem] = useState('');

  // Calculating stock data for cards
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < 20).length;
  const categories = [...new Set(inventory.map(item => item.category))].length + 1;

  const handleAddItem = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ name: '', category: '', quantity: '', expiryDate: '', supplier: '' });
  };

  const handleRemoveItem = () => setShowRemoveModal(true);
  const closeRemoveModal = () => setShowRemoveModal(false);

  const handleUpdateItem = () => setShowUpdateModal(true);
  const closeUpdateModal = () => setShowUpdateModal(false);

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
      if (sortBy === 'quantity') return a[sortBy] - b[sortBy];
      if (sortBy === 'expiryDate') return new Date(a[sortBy]) - new Date(b[sortBy]);
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
    setFilteredInventory(sortedInventory);
  };

  const handleRemoveSelectedItem = () => {
    const updatedInventory = inventory.filter(item => item.id !== selectedItem);
    setInventory(updatedInventory);
    setFilteredInventory(updatedInventory);
    closeRemoveModal();
  };

  const handleUpdateItemDetails = (e) => {
    e.preventDefault();
    const updatedInventory = inventory.map(item =>
      item.id === selectedItem
        ? { ...item, name: newItem.name, category: newItem.category, quantity: newItem.quantity, expiryDate: newItem.expiryDate, supplier: newItem.supplier }
        : item
    );
    setInventory(updatedInventory);
    setFilteredInventory(updatedInventory);
    closeUpdateModal();
  };

  return (
    <>
      <div className={styles.inventory}>
        <h1>Inventory Overview</h1>

        {/* Stock Overview Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Stock</h3>
            <p>{totalStock}</p>
          </div>
          <div className={styles.card}>
            <h3>Categories</h3>
            <p>{categories}</p>
          </div>
          <div className={styles.card}>
            <h3>Low Stock Items</h3>
            <p>{lowStockItems}</p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button id="addItemBtn" onClick={handleAddItem}>Add New Item</button>
          <button id="updateItemBtn" onClick={handleUpdateItem}>Update Item</button>
          <button id="removeItemBtn" onClick={handleRemoveItem}>Remove Item</button>
        </div>

        {/* Search and Sort */}
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

        {/* Inventory Table */}
        <table className="invent-table">
          <thead>
            <tr className="invent-header-row">
              <th>No.</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
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
              <input type="text" id="name" value={newItem.name} onChange={handleInputChange} required />
              <label htmlFor="category">Category:</label>
              <input type="text" id="category" value={newItem.category} onChange={handleInputChange} required />
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" id="quantity" value={newItem.quantity} onChange={handleInputChange} required />
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input type="date" id="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required />
              <label htmlFor="supplier">Supplier:</label>
              <input type="text" id="supplier" value={newItem.supplier} onChange={handleInputChange} required />
              <button type="submit">Save Item</button>
            </form>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {showRemoveModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeBtn} onClick={closeRemoveModal}>&times;</span>
            <h2>Select Item to Remove</h2>
            <select
              onChange={(e) => setSelectedItem(Number(e.target.value))}
              value={selectedItem}
            >
              <option value="">Select Item</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <button onClick={handleRemoveSelectedItem}>Remove Item</button>
          </div>
        </div>
      )}

      {/* Update Item Modal */}
      {showUpdateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeBtn} onClick={closeUpdateModal}>&times;</span>
            <h2>Update Item</h2>
            <form id="updateItemForm" onSubmit={handleUpdateItemDetails}>
              <label htmlFor="name">Item Name:</label>
              <input type="text" id="name" value={newItem.name} onChange={handleInputChange} required />
              <label htmlFor="category">Category:</label>
              <input type="text" id="category" value={newItem.category} onChange={handleInputChange} required />
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" id="quantity" value={newItem.quantity} onChange={handleInputChange} required />
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input type="date" id="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required />
              <label htmlFor="supplier">Supplier:</label>
              <input type="text" id="supplier" value={newItem.supplier} onChange={handleInputChange} required />
              <button type="submit">Update Item</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
