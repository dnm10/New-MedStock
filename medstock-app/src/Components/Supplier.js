import React, { useState } from "react";
import "./Supplier.css";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "ABC Pharma", contactPerson: "John Doe", phone: "1234567890", email: "abc@pharma.com", address: "123 Pharma Street" },
    { id: 2, name: "XYZ Meds", contactPerson: "Jane Smith", phone: "9876543210", email: "xyz@meds.com", address: "456 Med Lane" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddSupplier = () => {
    setModalOpen(true);
    setEditSupplier(null);
    setFormValues({ name: "", contactPerson: "", phone: "", email: "", address: "" });
  };

  const handleEditSupplier = (supplier) => {
    setModalOpen(true);
    setEditSupplier(supplier);
    setFormValues(supplier);
  };

  const handleSaveSupplier = () => {
    if (editSupplier) {
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === editSupplier.id ? { ...editSupplier, ...formValues } : supplier))
      );
    } else {
      setSuppliers((prev) => [
        ...prev,
        { id: Date.now(), ...formValues },
      ]);
    }
    setModalOpen(false);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  const handleOrderHistory = (supplier) => {
    alert(`Viewing order history for ${supplier.name}`);
  };

  return (
    <div className="supplier">
      <header>
        <h1>Suppliers Management</h1>
        <button onClick={handleAddSupplier} className="add-supplier-btn">Add New Supplier</button>
      </header>

      <table className="suppliers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone No</th>
            <th>Email Id</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.contactPerson}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td>{supplier.address}</td>
                        <td>
            <button className="edit-btn" onClick={() => handleEditSupplier(supplier)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
            <button className="order-history-btn" onClick={() => handleOrderHistory(supplier)}>Order History</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editSupplier ? "Edit Supplier" : "Add New Supplier"}</h2>
            <form>
              <label>Name:</label>
              <input type="text" name="name" value={formValues.name} onChange={handleInputChange} />

              <label>Contact Person:</label>
              <input type="text" name="contactPerson" value={formValues.contactPerson} onChange={handleInputChange} />

              <label>Phone:</label>
              <input type="text" name="phone" value={formValues.phone} onChange={handleInputChange} />

              <label>Email:</label>
              <input type="email" name="email" value={formValues.email} onChange={handleInputChange} />

              <label>Address:</label>
              <textarea name="address" value={formValues.address} onChange={handleInputChange}></textarea>

              <div className="modal-actions">
                <button type="button" onClick={handleSaveSupplier}>Save</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;

