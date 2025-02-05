import React, { useState } from "react";
import styles from "./Supplier.module.css";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Shree Pharma", contactPerson: "Ravi Verma", phone: "1234567890", email: "ravi.verma@gmail.com", address: "123 Shree Lane, Delhi" },
    { id: 2, name: "Jai Meds", contactPerson: "Vikram Singh", phone: "9876543210", email: "vikram.singh@gmail.com", address: "456 Jai Avenue, Mumbai" },
    { id: 3, name: "MediCare Solutions", contactPerson: "Amit Sharma", phone: "9999999999", email: "amit.sharma@gmail.com", address: "12 Health Avenue, Mumbai" },
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

  const handleSaveSupplier = () => {
    if (editSupplier) {
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === editSupplier.id ? { ...editSupplier, ...formValues } : supplier))
      );
    } else {
      setSuppliers((prev) => [...prev, { id: Date.now(), ...formValues }]);
    }
    setModalOpen(false);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className={styles.supplier}>
        <h1>Suppliers Management</h1>
      
      <button onClick={handleAddSupplier} className="add-supplier-btn">
          Add New Supplier
        </button>

      {/* Supplier Metrics Cards */}
      <div className="supplierCards">
        <div className="supplierCard">
          <h3>Total Suppliers</h3>
          <p>{suppliers.length}</p>
        </div>
        <div className="supplierCard">
          <h3>Active Suppliers</h3>
          <p>{suppliers.length}</p> {/* Replace with actual active count if needed */}
        </div>
      </div>

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
                <button
                  className="edit-btn"
                  onClick={() => {
                    setModalOpen(true);
                    setEditSupplier(supplier);
                    setFormValues(supplier);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
    <div className="supplierModal">
      <div className="supplierModalContent">
        <button
        type="button"
        className="supplierCloseBtn"
        onClick={() => setModalOpen(false)}
        >
        &times;
        </button>
      <h3>{editSupplier ? "Edit Supplier" : "Add New Supplier"}</h3>
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
            <button type="button" onClick={handleSaveSupplier}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
)}
    </div>
  );
};

export default Supplier;
