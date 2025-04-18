const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authDB, adminDB, userDB, medstockDB } = require('./connections');  // Import the MySQL connection
const app = express();
const bcrypt = require('bcrypt');
const mysql = require("mysql2/promise");
const validator = require('validator');

const port = 5000;
app.use(express.json());
app.use(cors());

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
}));

app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// User Signup
app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;

  if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if email already exists with a different role
  authDB.query('SELECT role FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
          if (results[0].role !== role) {
              return res.status(400).json({ message: `This email is already registered as ${results[0].role}. Please use a different email.` });
          } else {
              return res.status(400).json({ message: 'Email already exists' });
          }
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into auth_db
      authDB.query(
          'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
          [email, hashedPassword, role],
          (err, result) => {
              if (err) {
                  console.error('Signup error:', err);
                  return res.status(500).json({ message: 'Error signing up' });
              }

              // Insert into role-specific database
              const targetDB = role === 'Admin' ? adminDB : userDB;
              targetDB.query(
                  'INSERT INTO users (id, email, password, created_at) VALUES (?, ?, ?, NOW())',
                  [result.insertId, email, hashedPassword],
                  (err) => {
                      if (err) {
                          console.error('Error syncing user data:', err);
                          return res.status(500).json({ message: 'Error syncing user data' });
                      }

                      res.status(201).json({
                          message: 'Signup successful',
                          user: { id: result.insertId, email, role },
                      });
                  }
              );
          }
      );
  });
});


// User Login
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body; // Now role is required during login

  authDB.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role], async (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid email, password, or role' });
      }

      const user = results[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email, password, or role' });
      }

      res.status(200).json({
          message: 'Login successful',
          user: { id: user.id, email: user.email, role: user.role },
          redirectTo: user.role === 'Admin' ? '/admin/dashboard' : '/user/home',
      });
  });
});


// Protected Route Example
app.get('/api/dashboard', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    res.status(200).json({
      message: `Welcome ${decoded.role}`,
      dashboard: decoded.role === 'Admin' ? 'Admin Dashboard' : 'User Dashboard',
    });
  });
});

// Forget pass
app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  // ✅ Step 1: Check if email and password are provided
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required!" });
  }

  // ✅ Step 2: Log incoming request data for debugging
  console.log("Reset Password Request Received:");
  console.log("Email:", email);
  console.log("New Password:", newPassword);

  // ✅ Step 3: Update password in database
  const query = "UPDATE users SET password = ? WHERE email = ?";
  db.query(query, [newPassword, email], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Server error while resetting password" });
    }

    if (result.affectedRows === 0) {
      console.log("❌ No user found with this email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Password reset successful for:", email);
    res.json({ message: "Password reset successful!" });
  });
});

//INVENTORY PAGE/////////////////////////////////////
// GET inventory items
app.get('/api/inventory', (req, res) => {  
  medstockDB.query('SELECT * FROM inventory', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching inventory');
    }
    res.json(results);
  });
});

// Get low stock or expired medicines
app.get('/api/inventory/low-or-expired', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const query = `
    SELECT * FROM inventory 
    WHERE quantity < threshold OR expiryDate < ?
  `;

  medstockDB.query(query, [today], (err, results) => {
    if (err) {
      console.error("Error fetching low or expired medicines:", err);
      return res.status(500).json({ message: "Error fetching low or expired medicines" });
    }

    res.json(results);
  });
});


// Add new inventory item
app.post('/api/inventory', (req, res) => {  
  const { name, category, quantity, expiryDate, supplier, threshold, price } = req.body;
  const query = 'INSERT INTO inventory (name, category, quantity, expiryDate, supplier, threshold, price) VALUES (?, ?, ?, ?, ?, ?, ?)';

  medstockDB.query(query, [name, category, quantity, expiryDate, supplier, threshold, price], (err, result) => {    if (err) {
      return res.status(500).send('Error adding new item');
    }
    res.status(201).json({
      id: result.insertId, 
      name: name,
      category: category,
      quantity: quantity,
      expiryDate: expiryDate,
      supplier: supplier,
      threshold: threshold,
      price: price
    });
  });
});

// Update inventory item
app.put('/api/inventory/:id', (req, res) => {  // Changed to lowercase 'inventory'
  const { name, category, quantity, expiryDate, supplier, threshold, price} = req.body;

  const query = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, expiryDate = ?, supplier = ?, threshold = ?, price=? WHERE id = ?';

  medstockDB.query(query, [name, category, quantity, expiryDate, supplier, threshold, price, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send('Error updating item');
    }
    res.json({
      id: req.params.id,
      name, category, quantity, expiryDate, supplier, threshold, price
    });
  });
});

// Delete inventory item
app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM inventory WHERE id = ?';


  medstockDB.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting order' });
    }
    res.json({ message: `Order with ID ${id} deleted successfully` });
  });
});

// BILLING PAGE (user role)
// For billing: update inventory
app.post("/api/update-inventory", (req, res) => {
  const { name, quantity } = req.body;

  medstockDB.query("SELECT quantity FROM inventory WHERE name = ?", [name], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Item not found in inventory." });
    }

    const currentStock = results[0].quantity;

    if (currentStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }

    medstockDB.query(
      "UPDATE inventory SET quantity = quantity - ? WHERE name = ?",
      [quantity, name],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating inventory:", updateErr);
          return res.status(500).json({ message: "Error updating inventory." });
        }
        res.json({ message: "Inventory updated successfully." });
      }
    );
  });
});


// Save a new bill
app.post("/api/save-bill", (req, res) => {
  let { billItems, totalAmount, date, username } = req.body;

  if (!billItems || !totalAmount || !date || !username) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Normalize date to YYYY-MM-DD
  const normalizedDate = new Date(date).toISOString().split('T')[0];
  totalAmount = parseFloat(totalAmount);

  const jsonData = JSON.stringify({
    billItems,
    totalAmount,
    date: normalizedDate,
    username
  });

  console.log("Saving bill:", jsonData); // debug log

  const sql = `
    INSERT INTO userRole_billingPage (name, quantity, price)
    VALUES (?, ?, ?)
  `;
  const values = ["bill", 1, jsonData];

  medstockDB.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Bill saved successfully", billId: result.insertId });
  });
});


// Fetch all bills
app.get("/api/get-bills", (req, res) => {
  medstockDB.query("SELECT * FROM userRole_billingPage ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bills." });
    }

    const bills = results.map((row) => {
      try {
        const parsed = JSON.parse(row.price);
        return {
          id: row.id,
          ...parsed
        };
      } catch (e) {
        console.error("Error parsing bill:", row.price);
        return null;
      }
    }).filter(Boolean);

    console.log("Fetched bills:", bills); // debug log
    res.json(bills);
  });
});


// Clear all bills
app.delete("/api/clear-bills", (req, res) => {
  medstockDB.query("DELETE FROM userRole_billingPage", (err) => {
    if (err) {
      console.error("Error clearing bills:", err);
      return res.status(500).json({ message: "Error clearing bills." });
    }
    res.json({ message: "All bills cleared successfully." });
  });
});




// Fetch stock summary 
app.get('/api/reports/stock', (req, res) => {
  const stockQuery = `
    SELECT 
      (SELECT COUNT(*) FROM inventory) AS totalItems,
      (SELECT SUM(quantity) FROM inventory) AS totalStock,
      (SELECT COUNT(*) FROM inventory WHERE quantity < threshold) AS lowStock,
      (SELECT COUNT(*) FROM inventory WHERE expiryDate < NOW()) AS expiredItems
  `;

  medstockDB.query(stockQuery, (err, results) => {
    if (err) {
      console.error('Error fetching stock data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]); 
  });
});

// Fetch sales data (daily or monthly)
app.get('/api/reports/sales', (req, res) => {
  const { range } = req.query;
  let salesQuery = '';

  if (range === 'daily') {
    salesQuery = `
      SELECT name, SUM(quantity) AS quantity, price
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
      GROUP BY name, price
    `;
  } else if (range === 'monthly') {
    salesQuery = `
      SELECT name, SUM(quantity) AS quantity, price
      FROM sales
      WHERE MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())
      GROUP BY name, price
    `;
  } else {
    return res.status(400).json({ error: 'Invalid range' });
  }

  medstockDB.query(salesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching sales data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ sales: results });
  });
});

// 🔥 Today's Total Payout (calculate and save)
app.get('/api/reports/todays-payout', (req, res) => {
  const payoutQuery = `
    SELECT SUM(quantity * price) AS total_payout
    FROM sales
    WHERE DATE(sale_date) = CURDATE()
  `;

  medstockDB.query(payoutQuery, (err, results) => {
    if (err) {
      console.error('Error fetching today\'s payout:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const totalPayout = results[0].total_payout || 0;

    // Insert into payouts table
    const insertQuery = `
      INSERT INTO payouts (payout_amount, payout_date, created_by)
      VALUES (?, CURDATE(), ?)
    `;
    const createdBy = 'system'; // You can change or pass from frontend

    medstockDB.query(insertQuery, [totalPayout, createdBy], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting payout:', insertErr);
        return res.status(500).json({ error: 'Insert error' });
      }

      res.json({ total_payout: totalPayout, saved: true });
    });
  });
});

// 📜 Fetch payout history
app.get('/api/reports/payout-history', (req, res) => {
  const fetchQuery = `SELECT * FROM payouts ORDER BY payout_date DESC`;

  medstockDB.query(fetchQuery, (err, results) => {
    if (err) {
      console.error('Error fetching payout history:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ payouts: results });
  });
});

// Fetch low stock items
app.get('/api/reports/low-stock', (req, res) => {
  medstockDB.query('SELECT name, quantity, threshold FROM inventory WHERE quantity < threshold', (err, results) => {
    if (err) {
      console.error('Error fetching low stock items:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ items: results });
  });
});

// Fetch expired items to reports page
app.get('/api/reports/expired-items', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [expiredItems] = await medstockDB.query(
      'SELECT * FROM Inventory WHERE expiryDate < ?',
      [currentDate]
    );
    res.json(expiredItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expired items' });
  }
});



// SUPPLIERS PAGE//////////////////////////////////
// Get all suppliers
app.get("/api/suppliers", (req, res) => {
  medstockDB.query("SELECT * FROM Suppliers", (err, result) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      res.status(500).send("Error fetching suppliers");
    } else {
      res.json(result);
    }
  });
});

// Add a new supplier
app.post("/api/suppliers", (req, res) => {
  const { SupplierID, SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address } = req.body;
  const query = `INSERT INTO Suppliers (SupplierID, SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate) VALUES (?, ?, ?, ?, ?, ?, CURDATE())`;
  medstockDB.query(query, [SupplierID, SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address], (err, result) => {
    if (err) {
      console.error("Error adding supplier:", err);
      res.status(500).send("Error adding supplier");
    } else {
      res.send("Supplier added successfully");
    }
  });
});

// Update supplier
app.put("/api/suppliers/:id", (req, res) => {
  const supplierId = req.params.id;
  const { SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address } = req.body;
  const query = `UPDATE Suppliers SET SupplierName=?, ContactPerson=?, PhoneNumber=?, EmailAddress=?, Address=? WHERE SupplierID=?`;
  medstockDB.query(query, [SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, supplierId], (err, result) => {
    if (err) {
      console.error("Error updating supplier:", err);
      res.status(500).send("Error updating supplier");
    } else {
      res.send("Supplier updated successfully");
    }
  });
});

// Delete supplier
app.delete("/api/suppliers/:id", (req, res) => {
  const supplierId = req.params.id;
  medstockDB.query("DELETE FROM Suppliers WHERE SupplierID=?", [supplierId], (err, result) => {
    if (err) {
      console.error("Error deleting supplier:", err);
      res.status(500).send("Error deleting supplier");
    } else {
      res.send("Supplier deleted successfully");
    }
  });
});


// Billing PAGE///////////////////////////////////////////////////////
// Get Delivered Orders (Only orders that are delivered but not yet billed)
// ✅ Get delivered orders (not yet billed)
app.get("/api/get-delivered-orders", async (req, res) => {
  try {
    const [deliveredOrders] = await medstockDB.promise().query(`
      SELECT OrderID, TotalPrice, DeliveryDate
      FROM Orders
      WHERE Delivery_Status = TRUE
      AND OrderID NOT IN (SELECT OrderID FROM Bills);
    `);
    res.json(deliveredOrders);
  } catch (error) {
    console.error("Error fetching delivered orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get previous bills
app.get("/api/get-bills", async (req, res) => {
  try {
    const [bills] = await medstockDB.promise().query(`
      SELECT BillID, OrderID, BillingDate, CAST(TotalAmount AS DECIMAL(10,2)) AS TotalAmount
      FROM Bills
      ORDER BY BillingDate DESC;
    `);
    
    res.json(bills);
  } catch (error) {
    console.error("Error fetching previous bills:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Generate bill
app.post("/api/generate-bill", async (req, res) => {
  try {
    const { orderID } = req.body;

    // Check if order exists and is delivered
    const [order] = await medstockDB.promise().query(
      `SELECT TotalPrice FROM Orders WHERE OrderID = ? AND Delivery_Status = TRUE`,
      [orderID]
    );
    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found or not delivered" });
    }

    // Generate Bill ID
    const billID = `BILL${Date.now()}`;
    await medstockDB.promise().query(
      `INSERT INTO Bills (BillID, OrderID, TotalAmount) VALUES (?, ?, ?)`,
      [billID, orderID, order[0].TotalPrice]
    );

    // Get order items
    const [orderItems] = await medstockDB.promise().query(
      `SELECT MedicineName, Quantity, Price FROM OrderItems WHERE OrderID = ?`,
      [orderID]
    );

    // Insert into BillItems
    for (const item of orderItems) {
      await medstockDB.promise().query(
        `INSERT INTO BillItems (BillID, MedicineName, Quantity, Price) VALUES (?, ?, ?, ?)`,
        [billID, item.MedicineName, item.Quantity, item.Price]
      );
    }

    // ✅ Just return the BillID now
    res.json({
      message: "Bill generated successfully",
      billID,
    });

  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API for fetching invoice details (used in React popup)
app.get("/api/invoice/:billID", async (req, res) => {
  const { billID } = req.params;

  try {
    // Get bill info
    const [[bill]] = await medstockDB.promise().query(
      `SELECT BillID, OrderID, BillingDate, TotalAmount FROM Bills WHERE BillID = ?`,
      [billID]
    );

    if (!bill) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Get bill items
    const [items] = await medstockDB.promise().query(
      `SELECT MedicineName, Quantity, Price FROM BillItems WHERE BillID = ?`,
      [billID]
    );

    // Send bill and items as JSON
    res.json({ bill, items });
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    res.status(500).json({ error: error.message });
  }
});





const notifications = []; // Temporary storage

// Update inventory and trigger notification if stock is low
app.post("/api/update-inventory", (req, res) => {
  const { name, quantity } = req.body;

  medstockDB.query(
    "SELECT quantity, threshold FROM inventory WHERE name = ?",
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error." });

      if (results.length === 0) {
        return res.status(404).json({ message: "Item not found in inventory." });
      }

      const currentStock = results[0].quantity;
      const threshold = results[0].threshold;

      if (currentStock < quantity) {
        return res.status(400).json({ message: "Insufficient stock available." });
      }

      // Update inventory quantity
      medstockDB.query(
        "UPDATE inventory SET quantity = quantity - ? WHERE name = ?",
        [quantity, name],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ message: "Error updating inventory." });
          }

          res.json({ message: "Inventory updated successfully." });
        }
      );
    }
  );
});

// Get real-time notifications from database
app.get("/api/notifications", (req, res) => {
  const query = `SELECT name, category, quantity, expiryDate, supplier, threshold FROM inventory`;

  medstockDB.query(query, (err, results) => {
    if (err) {
      console.error("❌ Database query failed:", err.sqlMessage || err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("✅ Fetched inventory data:", results);

    let outOfStock = 0;
    let lowStock = 0;
    let arrivingStock = 0; // Modify this logic if needed
    let totalStock = 0;
    let stockPercentage = 100;

    let lowStockItems = [];
    let expiredItems = [];

    results.forEach((item) => {
      totalStock += item.quantity;

      // Check for expired items
      if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
        expiredItems.push({ name: item.name, expiryDate: item.expiryDate });
      }

      // Check for low stock
      if (item.quantity <= item.threshold && item.quantity > 0) {
        lowStock++;
        lowStockItems.push({ name: item.name, quantity: item.quantity });
      }

      // Check for out of stock
      if (item.quantity === 0) {
        outOfStock++;
      }
    });

    if (totalStock > 0) {
      stockPercentage = Math.round((totalStock / (totalStock + outOfStock)) * 100);
    }

    res.json({
      summary: {
        outOfStock,
        lowStock,
        arrivingStock,
        stockPercentage,
      },
      lowStockItems,
      expiredItems,
    });
  });
});


//USER PAGE///////////////////////////////////////////////
// ✅ GET all users
app.get("/users", (req, res) => {
  medstockDB.query("SELECT * FROM user_data ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ ADD new user
app.post("/users", (req, res) => {
  const { name, role, email, phone } = req.body;
  medstockDB.query(
    "INSERT INTO user_data (name, role, email, phone) VALUES (?, ?, ?, ?)",
    [name, role, email, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User added successfully" });
    }
  );
});

// ✅ UPDATE user
app.put("/users/:id", (req, res) => {
  const { name, role, email, phone } = req.body;
  const { id } = req.params;
  medstockDB.query(
    "UPDATE user_data SET name = ?, role = ?, email = ?, phone = ? WHERE id = ?",
    [name, role, email, phone, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    }
  );
});

// ✅ DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  medstockDB.query("DELETE FROM user_data WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});


// ORDERS//////////////////////
// ✅ GET all orders with grouped medicines
// GET /api/orders
app.get("/api/orders", async (req, res) => {
  try {
    const [orders] = await medstockDB.promise().query("SELECT * FROM Orders");

    // Fetch all order items and join with inventory
    const [items] = await medstockDB.promise().query(`
      SELECT 
        oi.OrderID,
        i.name AS MedicineName,
        oi.Quantity,
        oi.Price
      FROM OrderItems oi
      JOIN inventory i ON oi.InventoryID = i.id
    `);

    // Group items by OrderID
    const orderMap = {};
    for (const order of orders) {
      order.Medicines = [];
      orderMap[order.OrderID] = order;
    }

    for (const item of items) {
      if (orderMap[item.OrderID]) {
        orderMap[item.OrderID].Medicines.push({
          name: item.MedicineName,
          quantity: item.Quantity,
          price: item.Price,
        });
      }
    }

    res.json(Object.values(orderMap));
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});




// ✅ POST a new order
app.post('/api/orders', (req, res) => {
  const { OrderID, SupplierID, DeliveryDate, TotalPrice, medicines } = req.body;

  // Step 1: Insert into Orders table
  const orderQuery = `
    INSERT INTO Orders (OrderID, SupplierID, DeliveryDate, TotalPrice)
    VALUES (?, ?, ?, ?)
  `;

  medstockDB.query(orderQuery, [OrderID, SupplierID, DeliveryDate, TotalPrice], (err, result) => {
    if (err) {
      console.error("❌ Error inserting into Orders:", err);
      return res.status(500).json({ message: "Error adding order" });
    }

    // Step 2: Prepare OrderItems insert
    const itemsQuery = `
      INSERT INTO OrderItems (OrderID, InventoryID, Quantity, Price)
      VALUES ?
    `;

    const itemValues = medicines.map(med => [OrderID, med.id, med.quantity, med.price]);

    medstockDB.query(itemsQuery, [itemValues], (itemErr) => {
      if (itemErr) {
        console.error("❌ Error inserting into OrderItems:", itemErr);
        return res.status(500).json({ message: "Error adding order items" });
      }

      res.status(201).json({ message: "✅ Order added successfully!" });
    });
  });
});

// ✅ DELETE an order
app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    await medstockDB.promise().execute('DELETE FROM Orders WHERE OrderID = ?', [orderId]);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
});

// ✅ UPDATE delivery status
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { Delivery_Status, DeliveryDate } = req.body;
    const statusValue = Delivery_Status ? 1 : 0;

    await medstockDB.promise().execute(
      'UPDATE Orders SET Delivery_Status = ?, DeliveryDate = ? WHERE OrderID = ?',
      [statusValue, DeliveryDate, orderId]
    );

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
});

// ✅ GET upcoming orders
app.get('/api/orders/upcoming', async (req, res) => {
  try {
    const [rows] = await medstockDB.promise().query(`
      SELECT OrderID, SupplierID, DeliveryDate, Delivery_Status 
      FROM Orders 
      WHERE Delivery_Status = 0 
        AND DeliveryDate >= CURDATE() 
        AND DeliveryDate <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching upcoming orders:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming orders' });
  }
});
