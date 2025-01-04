import React from 'react';
import './Inventory.css';

export default function Inventory() {
  return (
    <>
      <div className="container">
        <h1>Inventory Overview</h1>
        <div className="controls">
          <button id="addItemBtn">Add New Item</button>
          <button id="updateItemBtn">Update Item</button>
          <button id="removeItemBtn">Remove Item</button>
          <button id="reportBtn">Inventory Report</button>
        </div>

        <div className="top-row">
          <div className="search-sort">
            <input type="text" id="searchBox" placeholder="Search..." />
          </div>
          <div className="sort-options">
            <label>Sort By: </label>
            <select id="sortOptions">
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="quantity">Quantity</option>
              <option value="expiryDate">Expiry Date</option>
              <option value="supplier">Supplier</option>
            </select>
            <button id="sortBtn">Sort</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="inventoryList">
            <tr>
              <td>1</td>
              <td>Sample Item</td>
              <td>Category A</td>
              <td>10</td>
              <td>2024-12-31</td>
              <td>Supplier X</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Sample Item 2</td>
              <td>Category B</td>
              <td>20</td>
              <td>2025-01-15</td>
              <td>Supplier Y</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Sample Item 3</td>
              <td>Category C</td>
              <td>5</td>
              <td>2024-11-30</td>
              <td>Supplier Z</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Sample Item 4</td>
              <td>Category D</td>
              <td>15</td>
              <td>2024-10-20</td>
              <td>Supplier W</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="addItemModal" className="modal" style={{ display: 'none' }}>
        <div className="modal-content">
          <span className="close-btn">&times;</span>
          <h2>Add New Item</h2>
          <form id="addItemForm">
            <label htmlFor="itemName">Item Name:</label>
            <input type="text" id="itemName" required /><br />

            <label htmlFor="category">Category:</label>
            <input type="text" id="category" required /><br />

            <label htmlFor="quantity">Quantity:</label>
            <input type="number" id="quantity" required /><br />

            <label htmlFor="expiryDate">Expiry Date:</label>
            <input type="date" id="expiryDate" required /><br />

            <label htmlFor="supplier">Supplier:</label>
            <input type="text" id="supplier" required /><br />

            <label htmlFor="minStock">Minimum Stock Level:</label>
            <input type="number" id="minStock" required /><br />

            <label htmlFor="itemImage">Add Image:</label>
            <input type="file" id="itemImage" /><br />

            <button type="submit">Save Item</button>
          </form>
        </div>
      </div>

      <div id="removeModal" className="modal">
        <div className="modal-content">
          <span id="closeRemoveModal" className="close">&times;</span>
          <h2>Remove Item</h2>

          <label htmlFor="removeItemDropdown">Select Item to Remove:</label>
          <select id="removeItemDropdown">
            <option value="">--Select an Item--</option>
          </select>

          <p>Are you sure you want to remove this item: <strong id="removeItemName"></strong>?</p>

          <div className="action-buttons">
            <button id="confirmRemoveBtn">Confirm Remove</button>
            <button id="cancelRemoveBtn">Cancel</button>
          </div>
        </div>
      </div>

      <div id="updateItemModal" className="modal">
        <div className="modal-content">
          <span className="close-update-btn">&times;</span>
          <h2>Update Item</h2>
          <label htmlFor="updateItemSelect">Select Item to Update:</label>
          <select id="updateItemSelect" required>
            <option value="">-- Select an Item --</option>
          </select>

          <div id="updateItemDetails" style={{ display: 'none' }}>
            <label htmlFor="updateItemName">Item Name:</label>
            <input type="text" id="updateItemName" required />
            <label htmlFor="updateCategory">Category:</label>
            <input type="text" id="updateCategory" required />
            <label htmlFor="updateQuantity">Quantity:</label>
            <input type="number" id="updateQuantity" required />
            <label htmlFor="updateExpiryDate">Expiry Date:</label>
            <input type="date" id="updateExpiryDate" required />
            <label htmlFor="updateSupplier">Supplier:</label>
            <input type="text" id="updateSupplier" required />
          </div>

          <button id="confirmUpdateBtn">Confirm Update</button>
        </div>
      </div>
    </>
  );
}