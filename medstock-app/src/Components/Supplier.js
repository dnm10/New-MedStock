import React, { useState } from "react";
import "./Supplier.css";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Shree Pharma", contactPerson: "Ravi Verma", phone: "1234567890", email: "ravi.verma@gmail.com", address: "123 Shree Lane, Delhi" },
    { id: 2, name: "Jai Meds", contactPerson: "Vikram Singh", phone: "9876543210", email: "vikram.singh@gmail.com", address: "456 Jai Avenue, Mumbai" },
    { id: 3, name: "MediCare Solutions", contactPerson: "Amit Sharma", phone: "9999999999", email: "amit.sharma@gmail.com", address: "12 Health Avenue, Mumbai" },
    { id: 4, name: "Sankalp Pharma", contactPerson: "Rajesh Kumar", phone: "8888888888", email: "rajesh.kumar@gmail.com", address: "98 Med Street, Delhi" },
    { id: 5, name: "Vibrant Health", contactPerson: "Arvind Patel", phone: "7777777777", email: "arvind.patel@gmail.com", address: "45 Wellness Road, Bangalore" },
    { id: 6, name: "HealthFirst Pharmacy", contactPerson: "Ravi Mehra", phone: "6666666666", email: "ravi.mehra@gmail.com", address: "56 Medicorp Lane, Chennai" },
    { id: 7, name: "CureMed Solutions", contactPerson: "Sunil Agarwal", phone: "5555555555", email: "sunil.agarwal@gmail.com", address: "78 Healing Road, Hyderabad" },
    { id: 8, name: "PharmaCare", contactPerson: "Vikas Yadav", phone: "4444444444", email: "vikas.yadav@gmail.com", address: "29 Cure Complex, Pune" },
    { id: 9, name: "Arogya Meds", contactPerson: "Pradeep Singh", phone: "3333333333", email: "pradeep.singh@gmail.com", address: "60 Wellness Park, Kolkata" },
    { id: 10, name: "MedPlus Solutions", contactPerson: "Manoj Joshi", phone: "2222222222", email: "manoj.joshi@gmail.com", address: "11 Health Hub, Ahmedabad" },
    { id: 11, name: "LifeCare Pharmaceuticals", contactPerson: "Naveen Reddy", phone: "1231231231", email: "naveen.reddy@gmail.com", address: "22 LifeCare Road, Chennai" },
    { id: 12, name: "CureMed Pharmacy", contactPerson: "Aakash Gupta", phone: "9879879879", email: "aakash.gupta@gmail.com", address: "35 Health Tower, Bangalore" },
    { id: 13, name: "MedWell", contactPerson: "Rajiv Chandra", phone: "5555555555", email: "rajiv.chandra@gmail.com", address: "78 Wellness Lane, Kolkata" },
    { id: 14, name: "Sarvodaya Pharmaceuticals", contactPerson: "Anil Mishra", phone: "6666666666", email: "anil.mishra@gmail.com", address: "54 Sarvodaya Complex, Mumbai" },
    { id: 15, name: "Rex Pharma", contactPerson: "Manoj Kumar", phone: "4444444444", email: "manoj.kumar@gmail.com", address: "12 Rex Street, Delhi" }
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
                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;

