import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { AiOutlineDatabase, AiOutlineAppstore, AiOutlineExclamationCircle, AiOutlineClose } from "react-icons/ai";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import toast from 'react-hot-toast';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
    api.get('/Inventory')
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
      toast.error("Please select an item to update!");
      return;
    }
    const itemToUpdate = inventory.find(item => item.id === selectedItem);
    if (!itemToUpdate) {
      toast.error("Selected item not found!");
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
        toast.error("Expiry date must be at least 1 year from today.");
        return;
      }
    }

    if (name === "supplier" && !onlyLettersRegex.test(value)) {
      toast.error("Supplier name should contain only alphabets and spaces.");
      return;
    }

    if (name === "category" && !onlyLettersRegex.test(value)) {
      toast.error("Category must contain only alphabets and spaces.");
      return;
    }

    if (name === "name" && (!alphaNumericRegex.test(value) || allNumbersRegex.test(value))) {
      toast.error("Name should contain letters and not be all numbers.");
      return;
    }

    if (name === "threshold") {
      const thresholdValue = parseInt(value, 10);
      if (isNaN(thresholdValue) || thresholdValue < 0) {
        toast.error("Threshold must be above 0.");
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

    api.post('/inventory', newItemWithId) 
      .then(() => {
        api.get('/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          });
        closeAddModal();
        toast.success("Item added successfully");
      })
      .catch(error => {
        console.error('Error adding item:', error);
        toast.error("Failed to add item");
      });
  };

  useEffect(() => {
    let filtered = inventory;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        Object.values(item)
          .map(value => String(value).toLowerCase())
          .join(' ')
          .includes(query)
      );
    }
    
    setFilteredInventory(filtered);
  }, [inventory, searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRemoveSelectedItem = () => {
    api.delete(`/inventory/${selectedItem}`)
      .then(() => {
        api.get('/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          });
        closeRemoveModal();
        toast.success("Item removed successfully");
      })
      .catch(error => {
        console.error('Error removing item:', error);
        toast.error("Failed to remove item");
      });
  };

  const handleUpdateItemDetails = (e) => {
    e.preventDefault();
    api.put(`/inventory/${selectedItem}`, newItem)
      .then(() => {
        api.get('/inventory')
          .then(response => {
            setInventory(response.data);
            setFilteredInventory(response.data);
          });
        closeUpdateModal();
        toast.success("Item updated successfully");
      })
      .catch(error => {
        console.error('Error updating item:', error);
        toast.error("Failed to update item");
      });
  };

  const data = [
    { name: "Category A", value: 40 },
    { name: "Category B", value: 30 },
    { name: "Category C", value: 20 },
    { name: "Low Stock", value: 10 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]; // Brand mapped colors for pie charts

  return (
    <div className="bg-slate-50 min-h-screen pb-10 px-5 md:px-8 font-sans mx-auto w-full">
      
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">Inventory Overview</h1>
      </div>

      {/* Stats Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto">
        {/* Chart 1 */}
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-center text-slate-800">Stock by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-center text-slate-800">Low Stock Items</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={[{ name: "Low Stock", value: 10 }, { name: "Sufficient", value: 90 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3 */}
        <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-center text-slate-800">Expired Items</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={[{ name: "Expired", value: 5 }, { name: "Valid", value: 95 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                <Cell fill="#ef4444" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar (Controls & Search) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" onClick={handleAddItem}>
            Add New Item
          </button>
          <button className="bg-white border-2 border-warning text-warning hover:bg-warning-bg px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm" onClick={handleUpdateItem}>
            Update Item
          </button>
          <button className="bg-white border-2 border-danger text-danger hover:bg-danger-bg px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm" onClick={handleRemoveItem}>
            Remove Item
          </button>
        </div>
        
        <div className="w-full md:w-auto flex-1 max-w-xl ml-auto mt-4 md:mt-0 flex gap-4">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-1/3 px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 transition-all shadow-sm hover:border-slate-400 cursor-pointer"
          >
            <option value="">All Categories</option>
            {[...new Set(inventory.map(item => item.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="relative w-2/3">
            <input 
              id="searchBox" 
              value={searchQuery}
              onChange={handleSearch} 
              placeholder="Search inventory items..." 
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-500 transition-all shadow-sm hover:border-slate-400" 
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto flex gap-6 items-center mb-4 px-2">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="w-3 h-3 inline-block bg-danger rounded-full shadow-sm"></span>
          Expired Items
        </p>
        <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="w-3 h-3 inline-block bg-warning rounded-full shadow-sm"></span>
          Low Stock Items
        </p>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto overflow-x-auto rounded-xl border border-slate-200 shadow-card bg-white mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="px-6 py-4">No.</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.map((item, index) => {
              const isExpired = new Date(item.expiryDate) < new Date();
              const isLowStock = item.quantity < item.threshold;
              
              let rowBg = "hover:bg-slate-50";
              let rowText = "text-slate-700";
              
              if (item.id === selectedItem) {
                rowBg = "bg-primary-50 hover:bg-primary-100 border-l-4 border-l-primary-500";
              } else if (isExpired) {
                rowBg = "bg-danger-bg hover:bg-red-200";
                rowText = "text-danger-text";
              } else if (isLowStock) {
                rowBg = "bg-warning-bg hover:bg-amber-200";
                rowText = "text-warning-text";
              }

              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`cursor-pointer transition-colors ${rowBg}`}
                >
                  <td className={`px-6 py-4 text-sm font-medium ${rowText}`}>{index + 1}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${rowText}`}>{item.name}</td>
                  <td className={`px-6 py-4 text-sm ${rowText}`}>{item.category}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${rowText}`}>{item.quantity}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${rowText}`}>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm ${rowText}`}>{new Date(item.expiryDate).toISOString().split('T')[0]}</td>
                  <td className={`px-6 py-4 text-sm ${rowText}`}>{item.supplier}</td>
                  <td className={`px-6 py-4 text-sm ${rowText}`}>{item.threshold}</td>
                </tr>
              );
            })}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-8 relative">
            <button onClick={closeAddModal} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all">
              <AiOutlineClose size={20} />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Add Item</h3>
            <form onSubmit={handleSaveItem} className="flex flex-col gap-4">
              <input type="text" name="name" placeholder="Item Name" value={newItem.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              <select name="category" value={newItem.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700">
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
              <div className="flex gap-4">
                <input type="number" name="quantity" placeholder="Quantity" value={newItem.quantity} onChange={handleInputChange} required className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleInputChange} required className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              </div>
              <div className="flex gap-4">
                <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                <input type="number" name="threshold" placeholder="Threshold" value={newItem.threshold} onChange={handleInputChange} required className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              </div>
              <input type="text" name="supplier" placeholder="Supplier" value={newItem.supplier} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 mt-2 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">Save Item</button>
            </form>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-8 relative">
            <button onClick={closeRemoveModal} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all">
               <AiOutlineClose size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Remove Item</h2>
            <select onChange={(e) => setSelectedItem(Number(e.target.value))} value={selectedItem || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700 mb-6">
              <option value="">Select Item to Remove</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <button className="w-full bg-danger hover:bg-danger-hover text-white py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all" onClick={handleRemoveSelectedItem}>
              Confirm Removal
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-8 relative">
            <button onClick={closeUpdateModal} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-danger-bg hover:text-danger hover:rotate-90 transition-all">
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Update Item</h2>
            <form onSubmit={handleUpdateItemDetails} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Item Name</label>
                <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <select name="category" value={newItem.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700">
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
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity</label>
                  <input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Price</label>
                  <input type="number" name="price" value={newItem.price} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Expiry Date</label>
                  <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Threshold</label>
                  <input type="number" name="threshold" value={newItem.threshold} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier</label>
                <input type="text" name="supplier" value={newItem.supplier} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-700" />
              </div>
              <button type="submit" className="w-full bg-warning hover:bg-amber-600 text-white py-3 mt-4 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
