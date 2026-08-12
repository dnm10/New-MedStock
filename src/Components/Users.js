import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", role: "", email: "", phone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from Backend
  const fetchUsers = async () => {
    try {
        const response = await api.get("/users");
        if (response.status === 200) {
            setUsers(response.data);
        } else {
            console.error("Error: ", response.data);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Open Modal for Add/Edit
  const openModal = (user = null) => {
    setCurrentUser(user);
    setFormValues(user || { name: "", role: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  // Save User (Add/Edit)
  const saveUser = async () => {
    try {
        let response;
        if (currentUser) {
            response = await api.put(`/users/${currentUser.id}`, formValues);
        } else {
            response = await api.post("/users", formValues);
        }

        if (response.status === 201 || response.status === 200) {
            fetchUsers(); // Refresh user list after save
            setIsModalOpen(false);
            toast.success("User saved successfully");
        } else {
            console.error("Error response:", response.data);
            toast.error("Failed to save user.");
        }
    } catch (error) {
        console.error("Error saving user:", error.response ? error.response.data : error);
        toast.error("Something went wrong while saving the user!");
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 px-5 md:px-8 font-sans mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 mt-6 py-6 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">Users Management</h1>
      </div>

      <div className="max-w-7xl mx-auto mb-6 flex justify-end">
        <button 
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl px-5 py-2.5 transition-colors shadow-sm"
          onClick={() => openModal()}
        >
          Add New User
        </button>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-card bg-white dark:bg-slate-800 mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{user.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Admin' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700 dark:text-slate-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-center">
                  <button 
                    className="text-primary-600 hover:text-primary-800 font-medium mr-4 transition-colors"
                    onClick={() => openModal(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentUser ? "Edit User" : "Add New User"}</h2>
            </div>
            
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formValues.name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm hover:border-slate-400"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Role</label>
                <select 
                  name="role" 
                  value={formValues.role} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all shadow-sm hover:border-slate-400"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formValues.email} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm hover:border-slate-400"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formValues.phone} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm hover:border-slate-400"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 mt-auto">
              <button 
                type="button" 
                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-900 font-medium rounded-xl transition-colors shadow-sm text-sm" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm" 
                onClick={saveUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
