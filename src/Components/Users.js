import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import styles from './Users.module.css';
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
    <div className={styles.users}>
      <h1>Users Management</h1>
      <button className={styles.addusersbtn}  onClick={() => openModal()}> Add New User</button>

      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button className={styles.userseditbtn} onClick={() => openModal(user)}>Edit</button>
                <button className={styles.usersdeletebtn} onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.usersmodal}>
          <div className={styles.usersmodalcontent}>
            <h2>{currentUser ? "Edit User" : "Add New User"}</h2>
            <form>
              <label>Name:</label>
              <input type="text" name="name" value={formValues.name} onChange={handleInputChange} />

              <label>Role:</label>
              <select name="role" value={formValues.role} onChange={handleInputChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>

              <label>Email:</label>
              <input type="email" name="email" value={formValues.email} onChange={handleInputChange} />

              <label>Phone:</label>
              <input type="text" name="phone" value={formValues.phone} onChange={handleInputChange} />

              <button type="button" className={styles.usersSaveOrderButton} onClick={saveUser}>Save</button>
              <button type="button" className={styles.usersCancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
