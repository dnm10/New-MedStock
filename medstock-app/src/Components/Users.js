import React, { useState } from "react";
import "./Users.css"; // Ensure you update the CSS file name if necessary

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Arjun Mehta", role: "Admin", email: "arjunmehta@gmail.com", phone: "9876543210", status: "Active" },
    { id: 2, name: "Vikram Das", role: "Pharmacist", email: "vikramdas@gmail.com", phone: "9898765432", status: "Inactive" },
    { id: 3, name: "Rohan Gupta", role: "Pharmacist", email: "rohangupta@gmail.com", phone: "9871203456", status: "Active" },
    { id: 4, name: "Amit Patel", role: "Admin", email: "amitpatel@gmail.com", phone: "9988123456", status: "Active" },
    { id: 5, name: "Kunal Rao", role: "Pharmacist", email: "kunalrao@gmail.com", phone: "9988997766", status: "Inactive" },
    { id: 6, name: "Deepak Joshi", role: "Pharmacist", email: "deepakjoshi@gmail.com", phone: "9873459876", status: "Active" },
    { id: 7, name: "Rajiv Menon", role: "Pharmacist", email: "rajivmenon@gmail.com", phone: "9875556666", status: "Active" },
    { id: 8, name: "Anil Kumar", role: "Admin", email: "anilkumar@gmail.com", phone: "9876543211", status: "Inactive" },
    { id: 9, name: "Sandeep Verma", role: "Pharmacist", email: "sandeepverma@gmail.com", phone: "9876544321", status: "Active" },
    { id: 10, name: "Manoj Sharma", role: "Admin", email: "manojsharma@gmail.com", phone: "9871234567", status: "Active" },
    { id: 11, name: "Nikhil Agarwal", role: "Pharmacist", email: "nikhilagarwal@gmail.com", phone: "9876546789", status: "Inactive" },
    { id: 12, name: "Ravi Kapoor", role: "Pharmacist", email: "ravikapoor@gmail.com", phone: "9876541234", status: "Active" },
    { id: 13, name: "Kishore Reddy", role: "Admin", email: "kishorereddy@gmail.com", phone: "9871113333", status: "Inactive" },
    { id: 14, name: "Suraj Singh", role: "Pharmacist", email: "surajsingh@gmail.com", phone: "9875678901", status: "Active" },
    { id: 15, name: "Ajay Bhat", role: "Admin", email: "ajaybhat@gmail.com", phone: "9876547890", status: "Active" }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
  const [currentUser, setCurrentUser] = useState(null); // State to track the user being edited
  const [formValues, setFormValues] = useState({ name: "", role: "", email: "", phone: "", password: "", confirmPassword: "", status: "Active" });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Open modal to add or edit a user
  const openModal = (user = null) => {
    setCurrentUser(user);
    setFormValues(user || { name: "", role: "", email: "", phone: "", password: "", confirmPassword: "", status: "Active" });
    setIsModalOpen(true); // Open the modal
  };

  // Save user (add or edit)
  const saveUser = () => {
    if (currentUser) {
      setUsers(users.map((user) => (user.id === currentUser.id ? { ...currentUser, ...formValues } : user)));
    } else {
      const newUser = { ...formValues, id: users.length + 1 };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false); // Close the modal after saving
  };

  // Delete user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="users-page">
      <h1>Users Management</h1>
      <button className="add-user-btn" onClick={() => openModal()}> Add New User</button> {/* Button to open modal */}

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
                <button className="edit-btn" onClick={() => openModal(user)}>Edit</button> {/* Edit Button */}
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button> {/* Delete Button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <div className="users-modal">
          <div className="users-modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button> {/* Close Button */}
            <h2>{currentUser ? "Edit User" : "Add New User"}</h2> {/* Title for Add/Edit */}
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

              <div className="modal-actions">
                <button type="button" className="save-btn" onClick={saveUser}>Save</button> {/* Save Button */}
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button> {/* Cancel Button */}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
