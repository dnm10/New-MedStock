import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Supplier.module.css";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formValues, setFormValues] = useState({
    SupplierName: "",
    ContactPerson: "",
    PhoneNumber: "",
    EmailAddress: "",
    Address: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/suppliers");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Regex patterns
    const nameRegex = /^[A-Za-z\s]+$/; // Only alphabets and spaces
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
    const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/; // Must be Gmail or Yahoo

    // Validate Supplier Name (Only alphabets and spaces)
    if (!formValues.SupplierName.trim() || !nameRegex.test(formValues.SupplierName)) {
        newErrors.SupplierName = "Supplier name should contain only alphabets.";
    }

    // Validate Contact Person (Only alphabets and spaces)
    if (!formValues.ContactPerson.trim() || !nameRegex.test(formValues.ContactPerson)) {
        newErrors.ContactPerson = "Contact person should contain only alphabets.";
    }

    // Validate Phone Number (Exactly 10 digits)
    if (!formValues.PhoneNumber.match(phoneRegex)) {
        newErrors.PhoneNumber = "Phone number must be exactly 10 digits.";
    }

    // Validate Email (Only Gmail or Yahoo)
    if (!formValues.EmailAddress.match(emailRegex)) {
        newErrors.EmailAddress = "Enter a valid email address";
    }

    // Validate Address (Required)
    if (!formValues.Address.trim()) {
        newErrors.Address = "Address is required.";
    }

    // Set errors in state
    setErrors(newErrors);

    // Return true if no errors exist
    return Object.keys(newErrors).length === 0;
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddSupplier = () => {
    setModalOpen(true);
    setEditSupplier(null);
    setFormValues({
      SupplierName: "",
      ContactPerson: "",
      PhoneNumber: "",
      EmailAddress: "",
      Address: "",
    });
    setErrors({});
  };

  const handleEditSupplier = (supplier) => {
    setModalOpen(true);
    setEditSupplier(supplier.SupplierID);
    setFormValues({
      SupplierName: supplier.SupplierName,
      ContactPerson: supplier.ContactPerson,
      PhoneNumber: supplier.PhoneNumber,
      EmailAddress: supplier.EmailAddress,
      Address: supplier.Address,
    });
    setErrors({});
  };

  const handleSaveSupplier = async () => {
    if (!validateForm()) return; // Stop if validation fails

    try {
      const method = editSupplier ? "PUT" : "POST";
      const url = editSupplier
        ? `http://localhost:5000/api/suppliers/${editSupplier}`
        : "http://localhost:5000/api/suppliers";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      fetchSuppliers();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "DELETE",
      });
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className={styles.supplier}>
      <h1>Suppliers Management</h1>
      <button onClick={handleAddSupplier} className="add-supplier-btn">
        Add New Supplier
      </button>
      <table className={styles.suppliersTable}>
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
            <tr key={supplier.SupplierID}>
              <td>{supplier.SupplierID}</td>
              <td>{supplier.SupplierName}</td>
              <td>{supplier.ContactPerson}</td>
              <td>{supplier.PhoneNumber}</td>
              <td>{supplier.EmailAddress}</td>
              <td>{supplier.Address}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditSupplier(supplier)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSupplier(supplier.SupplierID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen &&
        ReactDOM.createPortal(
          <div className={styles.supplierModal}>
            <div className={styles.supplierModalContent}>
              <h3>{editSupplier ? "Edit Supplier" : "Add New Supplier"}</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <label>Name:</label>
                <input type="text" name="SupplierName" value={formValues.SupplierName} onChange={handleInputChange} />
                {errors.SupplierName && <span className="error">{errors.SupplierName}</span>}

                <label>Contact Person:</label>
                <input type="text" name="ContactPerson" value={formValues.ContactPerson} onChange={handleInputChange} />
                {errors.ContactPerson && <span className="error">{errors.ContactPerson}</span>}

                <label>Phone:</label>
                <input type="text" name="PhoneNumber" value={formValues.PhoneNumber} onChange={handleInputChange} />
                {errors.PhoneNumber && <span className="error">{errors.PhoneNumber}</span>}

                <label>Email:</label>
                <input type="email" name="EmailAddress" value={formValues.EmailAddress} onChange={handleInputChange} />
                {errors.EmailAddress && <span className="error">{errors.EmailAddress}</span>}

                <label>Address:</label>
                <textarea name="Address" value={formValues.Address} onChange={handleInputChange}></textarea>
                {errors.Address && <span className="error">{errors.Address}</span>}

                <div className={styles.modalActions}>
                  <button type="button" className={styles.saveButton} onClick={handleSaveSupplier}>
                    Save
                  </button>
                  <button type="button" className={styles.closeButton} onClick={() => setModalOpen(false)}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Supplier;
