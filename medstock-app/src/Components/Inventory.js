import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { AiOutlineDatabase, AiOutlineAppstore, AiOutlineExclamationCircle } from "react-icons/ai";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


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
      .then(() => {
        axios.get('http://localhost:5000/api/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          });
        closeAddModal();
      })
      .catch(error => console.error('Error adding item:', error));
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
          });
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
          });
        closeUpdateModal();
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const data = [
  { name: "Category A", value: 40 },
  { name: "Category B", value: 30 },
  { name: "Category C", value: 20 },
  { name: "Low Stock", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Inventory Overview</h1>

      {/* Stats Charts */}
      <div className="grid grid-cols-1 justify-center md:grid-cols-3 gap-8 mb-5">
        {/* Chart 1 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">Stock by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">Low Stock Items</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Low Stock", value: 10 },
                  { name: "Sufficient", value: 90 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#FF8042"
                paddingAngle={5}
                dataKey="value"
                label
              >
                <Cell fill="#FF8042" />
                <Cell fill="#00C49F" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">Expired Items</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Expired", value: 5 },
                  { name: "Valid", value: 95 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#FF0000"
                paddingAngle={5}
                dataKey="value"
                label
              >
                <Cell fill="#FF0000" />
                <Cell fill="#00C49F" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Item</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Update Item</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove Item</button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input id="searchBox" onChange={handleSearch} placeholder="Search..." className="border px-4 py-2 rounded w-1/3" />
      </div>

      <div className="flex justify-center gap-6 items-center my-4">
        <p className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 inline-block bg-red-300 border border-red-500 rounded"></span>
          Expired Items
        </p>
        <p className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 inline-block bg-blue-300 border border-blue-500 rounded"></span>
          Low Stock Items
        </p>
      </div>



      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-blue-600">
          <tr>
            <th className="border px-4 py-2">No.</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Expiry Date</th>
            <th className="border px-4 py-2">Supplier</th>
            <th className="border px-4 py-2">Threshold</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`cursor-pointer ${item.id === selectedItem ? 'bg-blue-600' : new Date(item.expiryDate) < new Date() ? 'bg-red-100' : item.quantity < item.threshold ? 'bg-yellow-100' : ''}`}
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">Rs.{(item.price * item.quantity).toFixed(2)}</td>
              <td className="border px-4 py-2">{new Date(item.expiryDate).toISOString().split('T')[0]}</td>
              <td className="border px-4 py-2">{item.supplier}</td>
              <td className="border px-4 py-2">{item.threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow max-w-md w-full">
            <button onClick={closeAddModal} className="float-right text-xl">&times;</button>
            <h3 className="text-xl mb-4">Add Item</h3>
            <form onSubmit={handleSaveItem} className="flex flex-col gap-2">
              <input type="text" name="name" placeholder="Item Name" value={newItem.name} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <select name="category" value={newItem.category} onChange={handleInputChange} required className="border px-3 py-2 rounded">
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
              <input type="number" name="quantity" placeholder="Quantity" value={newItem.quantity} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <input type="text" name="supplier" placeholder="Supplier" value={newItem.supplier} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <input type="number" name="threshold" placeholder="Threshold" value={newItem.threshold} onChange={handleInputChange} required className="border px-3 py-2 rounded" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Save Item</button>
            </form>
          </div>
        </div>
      )}

        {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <button
              className="absolute top-4 right-4 text-xl font-bold"
              onClick={closeRemoveModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Select Item to Remove</h2>
            <select
              onChange={(e) => setSelectedItem(Number(e.target.value))}
              value={selectedItem || ""}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">Select Item</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleRemoveSelectedItem}
            >
              Remove Item
            </button>
          </div>
        </div>
      )}

      {showUpdateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 text-xl font-bold"
            onClick={closeUpdateModal}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">Update Item</h2>
          <form id="updateItemForm" onSubmit={handleUpdateItemDetails}>
            <label className="block mb-1">Item Name:</label>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-1">Category:</label>
            <select
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            >
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

            <label className="block mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-1">Price (per unit):</label>
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-1">Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              value={newItem.expiryDate}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-1">Supplier:</label>
            <input
              type="text"
              name="supplier"
              value={newItem.supplier}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <label className="block mb-1">Threshold:</label>
            <input
              type="number"
              name="threshold"
              value={newItem.threshold}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full mb-4"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    )}

    </div>
  );
}
