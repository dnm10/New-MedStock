import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Inventory.module.css';
import '../App.css';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  
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
    threshold: '', // New field for threshold
  });

  useEffect(() => {
    // Fetch the inventory data on page load (or after the page refreshes)
    axios.get('http://localhost:5000/api/Inventory')
      .then(response => {
        setInventory(response.data); // Set inventory data from the backend
        setFilteredInventory(response.data); // Update filtered inventory if needed
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  }, []);

  const [selectedItem, setSelectedItem] = useState('');

  // Calculating stock data for cards
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold).length; // Updated for threshold
  const categories = [...new Set(inventory.map(item => item.category))].length;

  const handleAddItem = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ name: '', category: '', quantity: '', expiryDate: '', supplier: '', threshold: '' });
  };

  const handleRemoveItem = () => setShowRemoveModal(true);
  const closeRemoveModal = () => setShowRemoveModal(false);

  const handleUpdateItem = () => {
    if (selectedItem) {
      const item = inventory.find(item => item.id === selectedItem);
      setNewItem({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
        supplier: item.supplier,
        threshold: item.threshold,
      });
      setShowUpdateModal(true);
    } else {
      alert('Please select an item to update!');
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setNewItem({ name: '', category: '', quantity: '', expiryDate: '', supplier: '', threshold: '' });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewItem({ ...newItem, [id]: value });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const newItemWithId = {
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity, 10),
      expiryDate: newItem.expiryDate,
      supplier: newItem.supplier,
      threshold: parseInt(newItem.threshold, 10), // Save threshold as a number
    };
  
    // Send a POST request to your backend API to save the new item to the database
    axios.post('http://localhost:5000/api/inventory', newItemWithId)
      .then(response => {
        // After the item is saved, fetch the updated inventory
        axios.get('http://localhost:5000/api/inventory')
          .then(response => {
            setInventory(response.data); // Update the inventory state with the latest data
            setFilteredInventory(response.data); // Update filtered inventory as well
          })
          .catch(error => console.error('Error fetching updated inventory:', error));
  
        // Close the modal and reset the form
        closeAddModal();
      })
      .catch(error => {
        console.error('Error adding item:', error);
      });
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
    axios.delete(`http://localhost:5000/api/inventory/${selectedItem}`)
      .then(response => {
        // After the item is removed, fetch the updated inventory
        axios.get('http://localhost:5000/api/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          })
          .catch(error => console.error('Error fetching inventory:', error));
  
        closeRemoveModal();
      })
      .catch(error => console.error('Error removing item:', error));
  };
  

  const handleUpdateItemDetails = (e) => {
    e.preventDefault();
  
    const updatedItem = {
      ...newItem,
      quantity: parseInt(newItem.quantity, 10),
      threshold: parseInt(newItem.threshold, 10),
    };
  
    axios.put(`http://localhost:5000/api/inventory/${selectedItem}`, updatedItem)
      .then(response => {
        // Re-fetch the updated inventory list from the backend
        axios.get('http://localhost:5000/api/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          })
          .catch(error => console.error('Error fetching inventory:', error));
  
        closeUpdateModal();
      })
      .catch(error => console.error('Error updating item:', error));
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
      <th>Threshold</th>
    </tr>
  </thead>
  <tbody>
    {filteredInventory.map((item, index) => (
      <tr
        key={item.id}
        style={{
          backgroundColor: item.quantity < item.threshold ? "#ffcccc" : "transparent",
        }}
      >
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.category}</td>
        <td>{item.quantity}</td>
        <td>{item.expiryDate}</td>
        <td>{item.supplier}</td>
        <td>{item.threshold}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className={styles.inventoryModal}>
          <div className={styles.inventoryModalContent}>
            <span className={styles.inventoryCloseBtn} onClick={closeAddModal}>&times;</span>
            <h3>Add Item</h3>
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
              <label htmlFor="threshold">Threshold:</label>
              <input type="number" id="threshold" value={newItem.threshold} onChange={handleInputChange} required />
              <button type="submit">Save Item</button>
            </form>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {showRemoveModal && (
        <div className={styles.inventoryModal}>
          <div className={styles.inventoryModalContent}>
            <span className={styles.inventoryCloseBtn} onClick={closeRemoveModal}>&times;</span>
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
        <div className={styles.inventoryModal}>
          <div className={styles.inventoryModalContent}>
            <span className={styles.inventoryCloseBtn} onClick={closeUpdateModal}>&times;</span>
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
              <label htmlFor="threshold">Threshold:</label>
              <input type="number" id="threshold" value={newItem.threshold} onChange={handleInputChange} required />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
