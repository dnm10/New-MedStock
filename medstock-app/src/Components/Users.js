import React, { useState } from "react";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Arjun Mehta", role: "Admin", email: "arjunmehta@gmail.com", phone: "9876543210", status: "Active" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", role: "", email: "", phone: "", password: "", confirmPassword: "", status: "Active" });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Open modal
  const openModal = (user = null) => {
    setCurrentUser(user);
    setFormValues(user || { name: "", role: "", email: "", phone: "", password: "", confirmPassword: "", status: "Active" });
    setIsModalOpen(true);
  };

  // Save user (add/edit)
  const saveUser = () => {
    if (currentUser) {
      setUsers(users.map((user) => (user.id === currentUser.id ? { ...currentUser, ...formValues } : user)));
    } else {
      const newUser = { ...formValues, id: users.length + 1 };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="users-page">
      <h1>Users Management</h1>
      <button className="add-user-btn" onClick={() => openModal()}> Add New User</button>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
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
              <td>{user.status}</td>
              <td>
               { /*<button className="edit-btn" onClick={() => openModal(user)}>Edit</button> */}
                <button className="delete-btn" onClick={() => setUsers(users.filter((u) => u.id !== user.id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="users-modal">
          <div className="users-modal-content modalContent">
            <h2>{currentUser ? "Edit User" : "Add New User"}</h2>
            <form>
              <label>Name:</label>
              <input type="text" name="name" value={formValues.name} onChange={handleInputChange} />

              <label>Role:</label>
              <select name="role" value={formValues.role} onChange={handleInputChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Pharmacist">Pharmacist</option>
              </select>

              <label>Email:</label>
              <input type="email" name="email" value={formValues.email} onChange={handleInputChange} />

              <label>Phone:</label>
              <input type="text" name="phone" value={formValues.phone} onChange={handleInputChange} />

              <label>Password:</label>
              <input type="password" name="password" value={formValues.password} onChange={handleInputChange} />

              <label>Confirm Password:</label>
              <input type="password" name="confirmPassword" value={formValues.confirmPassword} onChange={handleInputChange} />

              <button type="button" className="saveOrderButton" onClick={saveUser}>Save</button>
              <button type="button" className="cancelButton" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
