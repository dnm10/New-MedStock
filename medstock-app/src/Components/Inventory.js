import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Inventory.module.css';
import '../App.css';
import { AiOutlineDatabase, AiOutlineAppstore, AiOutlineExclamationCircle } from "react-icons/ai";

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
    price: '',
    expiryDate: '',
    supplier: '',
    threshold: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/Inventory')
      .then(response => {
        setInventory(response.data);
        setFilteredInventory(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold).length;
  const categories = [...new Set(inventory.map(item => item.category))].length;

  const handleAddItem = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ name: '', category: '', quantity: '', price: '', expiryDate: '', supplier: '', threshold: '' });
  };

  const handleRemoveItem = () => setShowRemoveModal(true);
  const closeRemoveModal = () => setShowRemoveModal(false);

  const handleUpdateItem = () => {
    if (!selectedItem) {
      alert("Please select an item to update!");
      return;
    }
    const itemToUpdate = inventory.find(item => item.id === selectedItem);
    if (!itemToUpdate) {
      alert("Selected item not found!");
      return;
    }
    setNewItem({ ...itemToUpdate });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setNewItem({ name: '', category: '', quantity: '', price: '', expiryDate: '', supplier: '', threshold: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const alphaNumericRegex = /^[A-Za-z0-9- ]+$/;
    const onlyLettersRegex = /^[A-Za-z ]+$/;
    const allNumbersRegex = /^\d+$/;

    if (name === "expiryDate") {
      const selectedDate = new Date(value);
      const minExpiryDate = new Date();
      minExpiryDate.setFullYear(minExpiryDate.getFullYear() + 1);
      if (selectedDate < minExpiryDate) {
        alert("Expiry date must be at least 1 year from today.");
        return;
      }
    }

    if (name === "supplier" && !onlyLettersRegex.test(value)) {
      alert("Supplier name should contain only alphabets and spaces.");
      return;
    }

    if (name === "category" && !onlyLettersRegex.test(value)) {
      alert("Category must contain only alphabets and spaces.");
      return;
    }

    if (name === "name" && (!alphaNumericRegex.test(value) || allNumbersRegex.test(value))) {
      alert("Name should contain letters and not be all numbers.");
      return;
    }

    if (name === "threshold") {
      const thresholdValue = parseInt(value, 10);
      if (isNaN(thresholdValue) || thresholdValue < 0) {
        alert("Threshold must be above 0.");
        return;
      }
    }

    if (name === "quantity" || name === "price") {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const alphaNumericRegex = /^[A-Za-z0-9- ]+$/;
    const onlyLettersRegex = /^[A-Za-z ]+$/;
    const allNumbersRegex = /^\d+$/;

    if (name === "expiryDate") {
      const selectedDate = new Date(value);
      const minExpiryDate = new Date();
      minExpiryDate.setFullYear(minExpiryDate.getFullYear() + 1);
      if (selectedDate < minExpiryDate) {
        alert("Expiry date must be at least 1 year from today.");
        setNewItem((prevItem) => ({ ...prevItem, [name]: "" }));
        return;
      }
    }

    if (["name", "supplier", "category"].includes(name)) {
      if (!alphaNumericRegex.test(value) || allNumbersRegex.test(value)) {
        alert(
          `${name.charAt(0).toUpperCase() + name.slice(1)} should contain at least one letter and not be all numbers.`
        );
        setNewItem((prevItem) => ({ ...prevItem, [name]: "" }));
        return;
      }
    }

    if (name === "category" && (!onlyLettersRegex.test(value) || allNumbersRegex.test(value))) {
      alert("Category Invalid.");
      setNewItem((prevItem) => ({ ...prevItem, [name]: "" }));
      return;
    }

    if (name === "quantity") {
      const quantityValue = parseInt(value, 10);
      if (isNaN(quantityValue) || quantityValue < 20) {
        alert("Quantity must be 20 or more.");
        setNewItem((prevItem) => ({ ...prevItem, [name]: "20" }));
        return;
      }
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const newItemWithId = {
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity, 10),
      price: parseFloat(newItem.price),
      expiryDate: newItem.expiryDate,
      supplier: newItem.supplier,
      threshold: parseInt(newItem.threshold, 10),
    };

    axios.post('http://localhost:5000/api/inventory', newItemWithId)
      .then(response => {
        axios.get('http://localhost:5000/api/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          })
          .catch(error => console.error('Error fetching updated inventory:', error));
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

  const handleRemoveSelectedItem = () => {
    axios.delete(`http://localhost:5000/api/inventory/${selectedItem}`)
      .then(() => {
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
    axios.put(`http://localhost:5000/api/inventory/${selectedItem}`, newItem)
      .then(() => {
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

  const expiredItems = inventory.filter(item => new Date(item.expiryDate) < new Date());

  return (
    <>
      <div className={styles.inventory}>
        <h1>Inventory Overview</h1>
        <div className={styles.cards}>
          <div className={styles.card}><AiOutlineDatabase size={30} /><h3>Total Stock</h3><p>{totalStock}</p></div>
          <div className={styles.card}><AiOutlineAppstore size={30} /><h3>Categories</h3><p>{categories}</p></div>
          <div className={styles.card}><AiOutlineExclamationCircle size={30} color="red" /><h3>Low Stock Items</h3><p>{lowStockItems}</p></div>
        </div>

        <div className={styles.controls}>
          <button id="addItemBtn" onClick={handleAddItem}>Add New Item</button>
          <button id="updateItemBtn" onClick={handleUpdateItem}>Update Item</button>
          <button id="removeItemBtn" onClick={handleRemoveItem}>Remove Item</button>
        </div>

        <div className={styles.topRow}>
          <div className={styles.searchSort}>
            <input type="text" id="searchBox" placeholder="Search..." onChange={handleSearch} />
          </div>
        </div>

        <div className={styles.colorLegend}>
          <p><span className={styles.expiredLegend}></span> Expired Items</p>
          <p><span className={styles.lowStockLegend}></span> Low Stock Items</p>
        </div>

        <table className={styles.inventoryTable}>
          <thead>
            <tr className="invent-header-row">
              <th>No.</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                style={{
                  backgroundColor:
                    item.id === selectedItem ? "#cce5ff" :
                      new Date(item.expiryDate) < new Date() ? "#ffcccc" :
                        item.quantity < item.threshold ? "#cce5ff" : "transparent",
                  cursor: "pointer",
                }}
              >
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>Rs.{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
                <td>{new Date(item.expiryDate).toISOString().split('T')[0]}</td>
                <td>{item.supplier}</td>
                <td>{item.threshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.inventoryModal}>
          <div className={styles.inventoryModalContent}>
            <span className={styles.inventoryCloseBtn} onClick={closeAddModal}>&times;</span>
            <h3>Add Item</h3>
            <form onSubmit={handleSaveItem}>
              <label>Item Name:</label>
              <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
              <label>Category:</label>
              <select name="category" value={newItem.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="tablet">Tablet</option>
                <option value="syrup">Syrup</option>
                <option value="lotion">Lotion</option>
                <option value="oil">Oil</option>
                <option value="spray">Spray</option>
                <option value="injection">Injection</option>
                <option value="ointment">Ointment</option>
                <option value="cream">Cream/gel</option>
                <option value="drops">Drops</option>
                <option value="other">Other</option>
              </select>
              <label>Quantity:</label>
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required />
              <label>Price (per unit):</label>
              <input type="number" name="price" value={newItem.price} onChange={handleInputChange} required />
              <label>Expiry Date:</label>
              <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required />
              <label>Supplier:</label>
              <input type="text" name="supplier" value={newItem.supplier} onChange={handleInputChange} required />
              <label>Threshold:</label>
              <input type="number" name="threshold" value={newItem.threshold} onChange={handleInputChange} required />
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

{showUpdateModal && (
  <div className={styles.inventoryModal}>
    <div className={styles.inventoryModalContent}>
      <span className={styles.inventoryCloseBtn} onClick={closeUpdateModal}>&times;</span>
      <h2>Update Item</h2>
      <form id="updateItemForm" onSubmit={handleUpdateItemDetails}>
        <label htmlFor="name">Item Name:</label>
        <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
        <label htmlFor="category">Category:</label>
        <select name="category" value={newItem.category} onChange={handleInputChange} required>
          <option value="">Select Category</option>
          <option value="tablet">Tablet</option>
          <option value="syrup">Syrup</option>
          <option value="lotion">Lotion</option>
          <option value="oil">Oil</option>
          <option value="spray">Spray</option>
          <option value="injection">Injection</option>
          <option value="ointment">Ointment</option>
          <option value="cream">Cream/gel</option>
          <option value="drops">Drops</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="quantity">Quantity:</label>
        <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required />
        <label htmlFor="price">Price (per unit): </label>
        <input type="number" name="price" value={newItem.price} onChange={handleInputChange} required />
        <label htmlFor="expiryDate">Expiry Date:</label>
        <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required />
        <label htmlFor="supplier">Supplier:</label>
        <input type="text" name="supplier" value={newItem.supplier} onChange={handleInputChange} required />
        <label htmlFor="threshold">Threshold:</label>
        <input type="number" name="threshold" value={newItem.threshold} onChange={handleInputChange} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  </div>
)}
    </>
  );
}
