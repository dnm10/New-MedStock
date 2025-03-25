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

// Add new inventory item
app.post('/api/inventory', (req, res) => {  
  const { name, category, quantity, expiryDate, supplier, threshold } = req.body;
  const query = 'INSERT INTO inventory (name, category, quantity, expiryDate, supplier, threshold) VALUES (?, ?, ?, ?, ?, ?)';

  medstockDB.query(query, [name, category, quantity, expiryDate, supplier, threshold], (err, result) => {    if (err) {
      return res.status(500).send('Error adding new item');
    }
    res.status(201).json({
      id: result.insertId, 
      name: name,
      category: category,
      quantity: quantity,
      expiryDate: expiryDate,
      supplier: supplier,
      threshold: threshold
    });
  });
});

// Update inventory item
app.put('/api/inventory/:id', (req, res) => {  // Changed to lowercase 'inventory'
  const { name, category, quantity, expiryDate, supplier, threshold } = req.body;

  const query = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, expiryDate = ?, supplier = ?, threshold = ? WHERE id = ?';

  medstockDB.query(query, [name, category, quantity, expiryDate, supplier, threshold, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send('Error updating item');
    }
    res.json({
      id: req.params.id,
      name, category, quantity, expiryDate, supplier, threshold
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

// BILLING PAGE (user role)///////////////////////
// for billing
app.post("/api/update-inventory", (req, res) => {
  const { name, quantity } = req.body;

  // Check current stock
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

    // Update stock
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


// Add a new bill
app.post("/api/add-bill", async (req, res) => {
  const { name, quantity, price } = req.body;
  
  if (!name || !quantity || !price) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const sql = `INSERT INTO userRole_billingPage (name, quantity, price) VALUES (?, ?, ?)`;
    const values = [name, quantity, price];

    medstockDB.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({ message: "Bill added successfully", billId: result.insertId });
    });
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Get all bills
app.get("/api/get-bills", (req, res) => {
  medstockDB.query("SELECT * FROM userRole_billingPage ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Error fetching bills:", err);
      return res.status(500).json({ message: "Error fetching bills." });
    }
    res.json(results);
  });
});

// Clear all bills after invoice is generated
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
    const [expiredItems] = await db.query(
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
app.get("/api/get-delivered-orders", async (req, res) => {
  try {
    const [deliveredOrders] = await con.promise().query(`
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

// Get Previous Bills
app.get("/api/get-bills", async (req, res) => {
  try {
    const [bills] = await con.promise().query(`
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

// Generate a Bill for a Delivered Order
app.post("/api/generate-bill", async (req, res) => {
  try {
    const { orderID } = req.body;

    // Check if order exists and is delivered
    const [order] = await con.promise().query(
      `SELECT TotalPrice FROM Orders WHERE OrderID = ? AND Delivery_Status = TRUE`,
      [orderID]
    );
    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found or not delivered" });
    }

    // Generate unique Bill ID
    const billID = `BILL${Date.now()}`;
    await con.promise().query(
      `INSERT INTO Bills (BillID, OrderID, TotalAmount) VALUES (?, ?, ?)`,
      [billID, orderID, order[0].TotalPrice]
    );

    // Fetch order items
    const [orderItems] = await con.promise().query(
      `SELECT MedicineName, Quantity, Price FROM OrderItems WHERE OrderID = ?`,
      [orderID]
    );

    // Insert order items into BillItems
    for (const item of orderItems) {
      await con.promise().query(
        `INSERT INTO BillItems (BillID, MedicineName, Quantity, Price) VALUES (?, ?, ?, ?)`,
        [billID, item.MedicineName, item.Quantity, item.Price]
      );
    }

    res.json({ message: "Bill generated successfully", billID });
  } catch (error) {
    console.error("Error generating bill:", error);
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
// ✅ Fetch all orders with proper JOIN to inventory
app.get('/api/orders', async (req, res) => {
  try {
    const query = `
      SELECT o.OrderID, o.SupplierID, o.TotalPrice, o.DeliveryDate, o.Delivery_Status, 
             i.name AS MedicineName, oi.Quantity, oi.Price 
      FROM Orders o 
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      LEFT JOIN inventory i ON oi.InventoryID = i.id
    `;

    const [rows] = await medstockDB.promise().query(query);

    // Group orders by OrderID
    const orders = rows.reduce((acc, row) => {
      let order = acc.find(o => o.OrderID === row.OrderID);
      if (!order) {
        order = {
          OrderID: row.OrderID,
          SupplierID: row.SupplierID,
          TotalPrice: row.TotalPrice,
          DeliveryDate: row.DeliveryDate,
          Delivery_Status: row.Delivery_Status,
          Medicines: []
        };
        acc.push(order);
      }
      if (row.MedicineName) {
        order.Medicines.push({
          MedicineName: row.MedicineName,
          Quantity: row.Quantity,
          Price: row.Price
        });
      }
      return acc;
    }, []);

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
});

// ✅ Add a new order (using InventoryID)
app.post('/api/orders', async (req, res) => {
  //const connection = await medstockDB.getConnection(); // use medstockDB
  const connection = await medstockDB.promise().getConnection();

  const { OrderID, SupplierID, DeliveryDate, TotalPrice, medicines } = req.body;

  if (!OrderID || !SupplierID || !DeliveryDate || !TotalPrice || !medicines || medicines.length === 0) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await connection.beginTransaction();

    // Insert into Orders table
    await connection.execute(
      `INSERT INTO Orders (OrderID, SupplierID, TotalPrice, DeliveryDate, Delivery_Status) VALUES (?, ?, ?, ?, ?)`,
      [OrderID, SupplierID, TotalPrice, DeliveryDate, false]
    );

    const orderItemsQuery = `INSERT INTO OrderItems (OrderID, InventoryID, Quantity, Price) VALUES (?, ?, ?, ?)`;

    for (const medicine of medicines) {
      console.log("👉 Inserting medicine:", medicine.name);
      // Fetch InventoryID from inventory using medicine.name
      const [inventoryRows] = await connection.execute(
        `SELECT id FROM inventory WHERE name = ? LIMIT 1`,
        [medicine.name]
      );

      if (inventoryRows.length === 0) throw new Error(`Medicine not found in inventory: ${medicine.name}`);

      const inventoryId = inventoryRows[0].id;

      await connection.execute(orderItemsQuery, [OrderID, inventoryId, medicine.quantity, medicine.price]);
    }

    await connection.commit();
    res.status(201).json({ message: "Order added successfully" });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error adding order:', error);
    res.status(500).json({ error: "Failed to add order", details: error.message });
  } finally {
    connection.release();
  }
});

// ✅ Delete an order
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

// ✅ Update delivery status
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { Delivery_Status } = req.body;
    const statusValue = Delivery_Status ? 1 : 0;

    await medstockDB.promise().execute(
      'UPDATE Orders SET Delivery_Status = ? WHERE OrderID = ?',
      [statusValue, orderId]
    );

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
});

// ✅ API to fetch upcoming orders
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
