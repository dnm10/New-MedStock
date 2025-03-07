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

  //const [selectedItem, setSelectedItem] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);


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

 /* const handleUpdateItem = () => {
    if (selectedItem) {
      const newItem = inventory.find(item => item.id === selectedItem);
      setNewItem({
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        expiryDate: newItem.expiryDate,
        supplier: newItem.supplier,
        threshold: newItem.threshold,
      });
      setShowUpdateModal(true);
    } else {
      alert('Please select an item to update!');
    }
  }; */

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
    setShowUpdateModal(true);  // ✅ Now, the modal will open
  };
  
  

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setNewItem({ name: '', category: '', quantity: '', expiryDate: '', supplier: '', threshold: '' });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Regex patterns
    const alphaNumericRegex = /^[A-Za-z0-9- ]+$/; // Alphabets, numbers, hyphens, spaces
    const onlyLettersRegex = /^[A-Za-z ]+$/; // Only alphabets and spaces
    const allNumbersRegex = /^\d+$/; // Only numbers

    // Validate expiry date
    if (name === "expiryDate") {
        const selectedDate = new Date(value);
        const minExpiryDate = new Date();
        minExpiryDate.setFullYear(minExpiryDate.getFullYear() + 1);

        if (selectedDate < minExpiryDate) {
            alert("Expiry date must be at least 1 year from today.");
            return;
        }
    }

    // Validate name, supplier, and category
    if (["name", "supplier", "category"].includes(name)) {
        if (!alphaNumericRegex.test(value) || allNumbersRegex.test(value)) {
            alert(`${name.charAt(0).toUpperCase() + name.slice(1)} should contain at least one letter and not be all numbers.`);
            return;
        }
    }

    // Validate category separately (only letters allowed)
    if (name === "category" && (!onlyLettersRegex.test(value) || allNumbersRegex.test(value))) {
        alert("Category must contain only letters.");
        return;
    }

    // Validate threshold (should be a positive number)
    if (name === "threshold") {
        const thresholdValue = parseInt(value, 10);
        if (isNaN(thresholdValue) || thresholdValue < 0) {
            alert("Threshold must be a positive number.");
            return;
        }
    }

    // If all validations pass, update state
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
};


const handleInputBlur = (e) => {
    const { name, value } = e.target;

    // Regex patterns
    const alphaNumericRegex = /^[A-Za-z0-9- ]+$/; // Alphabets, numbers, hyphens, spaces
    const onlyLettersRegex = /^[A-Za-z ]+$/; // Only alphabets and spaces
    const allNumbersRegex = /^\d+$/; // Only numbers

    // Validate expiry date
    if (name === "expiryDate") {
        const selectedDate = new Date(value);
        const minExpiryDate = new Date();
        minExpiryDate.setFullYear(minExpiryDate.getFullYear() + 1);

        if (selectedDate < minExpiryDate) {
            alert("Expiry date must be at least 1 year from today.");
            setNewItem((prevItem) => ({ ...prevItem, [name]: "" })); // Reset invalid value
            return;
        }
    }

    // Validate name, supplier, and category
    if (["name", "supplier", "category"].includes(name)) {
        if (!alphaNumericRegex.test(value) || allNumbersRegex.test(value)) {
            alert(
                `${name.charAt(0).toUpperCase() + name.slice(1)} should contain at least one letter and not be all numbers.`
            );
            setNewItem((prevItem) => ({ ...prevItem, [name]: "" }));
            return;
        }
    }

    // Validate category separately for only letters
    if (name === "category" && (!onlyLettersRegex.test(value) || allNumbersRegex.test(value))) {
        alert("Category Invalid.");
        setNewItem((prevItem) => ({ ...prevItem, [name]: "" }));
        return;
    }

    // Validate quantity (should be 20 or more)
    if (name === "quantity") {
        const quantityValue = parseInt(value, 10);

        if (isNaN(quantityValue) || quantityValue < 20) {
            alert("Quantity must be 20 or more.");
            setNewItem((prevItem) => ({ ...prevItem, [name]: "20" })); // Reset to 20 if invalid
            return;
        }
    }
};


  const handleSaveItem = (e) => {
    e.preventDefault();
    console.log("Sve button clicked!");
    const newItemWithId = {
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity, 10),
      expiryDate: newItem.expiryDate,
      supplier: newItem.supplier,
      threshold: parseInt(newItem.threshold, 10), // Save threshold as a number
    };
  

    const handleUpdateItemDetails = (e) => {
      e.preventDefault();
    
      if (!selectedItem) {
        alert("No item selected for update!");
        return;
      }
    
      axios.put(`http://localhost:5000/api/inventory/${selectedItem}`, newItem)
        .then(() => {
          return axios.get('http://localhost:5000/api/inventory');
        })
        .then(response => {
          setInventory(response.data);
          setFilteredInventory(response.data);
          closeUpdateModal();
        })
        .catch(error => console.error('Error updating item:', error));
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
/*
  const handleSort = () => {
    const sortBy = document.getElementById('sortOptions').value;
    const sortedInventory = [...filteredInventory].sort((a, b) => {
      if (sortBy === 'quantity') return a[sortBy] - b[sortBy];
      if (sortBy === 'expiryDate') return new Date(a[sortBy]) - new Date(b[sortBy]);
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
    setFilteredInventory(sortedInventory);
  };
*/
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
           { /*<label>Sort By: </label> }
            <select id="sortOptions">
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="quantity">Quantity</option>
              <option value="expiryDate">Expiry Date</option>
              <option value="supplier">Supplier</option>
            </select>
           { /*<button id="sortBtn" onClick={handleSort}>Sort</button> */}
          </div>
        </div>

        {/* Inventory Table */}
        <table className={styles.inventoryTable}>
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
      onClick={() => setSelectedItem(item.id)}
      style={{
        backgroundColor:
          item.id === selectedItem ? "#cce5ff" :
          item.quantity < item.threshold ? "#ffcccc" : "transparent",
        cursor: "pointer",
      }}
    >
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.quantity}</td>
      <td>{new Date(item.expiryDate).toISOString().split('T')[0]}</td> {/* YYYY-MM-DD Format */}
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
              <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
              <label htmlFor="category">Category:</label>
              <input type="text" name="category" value={newItem.category} onChange={handleInputChange} required />
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required />
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required />
              <label htmlFor="supplier">Supplier:</label>
              <input type="text" name="supplier" value={newItem.supplier} onChange={handleInputChange} required />
              <label htmlFor="threshold">Threshold:</label>
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
        <input type="text" name="category" value={newItem.category} onChange={handleInputChange} required />
        <label htmlFor="quantity">Quantity:</label>
        <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required />
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
