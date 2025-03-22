const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const con = require('./connections'); // Import the MySQL connection

const app = express();
const port = 5000;

const mysql = require("mysql2/promise");


app.use(express.json());
app.use(cors());

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
}));

app.use(bodyParser.json());

// Test MySQL connection
con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + con.threadId);
});


const validator = require('validator');

// User Signup
app.post('/api/signup', (req, res) => {
  const { email, password, role } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  con.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    con.query(query, [email, password, role], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error signing up' });

      res.status(201).json({
        message: 'Signup successful',
        user: { id: result.insertId, email, role },
      });
    });
  });
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  con.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
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


// GET inventory items
app.get('/api/inventory', (req, res) => {  
  con.query('SELECT * FROM inventory', (err, results) => {
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

  con.query(query, [name, category, quantity, expiryDate, supplier, threshold], (err, result) => {    if (err) {
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

  con.query(query, [name, category, quantity, expiryDate, supplier, threshold, req.params.id], (err, result) => {
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


  con.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting order' });
    }
    res.json({ message: `Order with ID ${id} deleted successfully` });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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

  con.query(stockQuery, (err, results) => {
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

  con.query(salesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching sales data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ sales: results });
  });
});

// Fetch low stock items
app.get('/api/reports/low-stock', (req, res) => {
  con.query('SELECT name, quantity, threshold FROM inventory WHERE quantity < threshold', (err, results) => {
    if (err) {
      console.error('Error fetching low stock items:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ items: results });
  });
});

// ORDERS ///////////////////////////////////////////////
// ✅ Fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    const query = `
      SELECT o.OrderID, o.SupplierID, o.TotalPrice, o.DeliveryDate, o.Delivery_Status, 
             oi.MedicineName, oi.Quantity, oi.Price 
      FROM Orders o 
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
    `;
    const [rows] = await con.promise().query(query);

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


// ✅ Add a new order
app.post('/api/orders', async (req, res) => {
  const connection = await con.promise();
  const { OrderID, SupplierID, DeliveryDate, TotalPrice, medicines } = req.body;

  console.log("📥 Received Order Data:", req.body);

  if (!OrderID || !SupplierID || !DeliveryDate || !TotalPrice || !medicines || medicines.length === 0) {
    console.error("⚠️ Missing fields:", { OrderID, SupplierID, DeliveryDate, TotalPrice, medicines });
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await connection.beginTransaction();

    // Insert into Orders table
    const orderQuery = `
      INSERT INTO Orders (OrderID, SupplierID, TotalPrice, DeliveryDate, Delivery_Status)
      VALUES (?, ?, ?, ?, ?)`;
    
    await connection.execute(orderQuery, [OrderID, SupplierID, TotalPrice, DeliveryDate, false]);

    console.log(`✅ Order ${OrderID} inserted into Orders table`);

    // Insert medicines into OrderItems table
    const orderItemsQuery = `
      INSERT INTO OrderItems (OrderID, MedicineName, Quantity, Price)
      VALUES (?, ?, ?, ?)`;

    for (const medicine of medicines) {
      console.log(`📝 Inserting medicine:`, medicine);
      await connection.execute(orderItemsQuery, [OrderID, medicine.name, medicine.quantity, medicine.price]);
    }

    await connection.commit();
    console.log(`✅ Order ${OrderID} committed successfully`);

    res.status(201).json({ message: "Order added successfully" });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error adding order:', error.message, error.stack);
    res.status(500).json({ error: "Failed to add order", details: error.message });
  }
});


// ✅ Delete an order
app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    await con.promise().execute('DELETE FROM Orders WHERE OrderID = ?', [orderId]);
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

    await con.promise().execute(
      'UPDATE Orders SET Delivery_Status = ? WHERE OrderID = ?',
      [statusValue, orderId]
    );

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
});

// --- SUPPLIERS ROUTES ---
// Get all suppliers
app.get("/api/suppliers", (req, res) => {
  con.query("SELECT * FROM Suppliers", (err, result) => {
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
  con.query(query, [SupplierID, SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address], (err, result) => {
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
  con.query(query, [SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, supplierId], (err, result) => {
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
  con.query("DELETE FROM Suppliers WHERE SupplierID=?", [supplierId], (err, result) => {
    if (err) {
      console.error("Error deleting supplier:", err);
      res.status(500).send("Error deleting supplier");
    } else {
      res.send("Supplier deleted successfully");
    }
  });
});

// for billing
app.post("/api/update-inventory", (req, res) => {
  const { name, quantity } = req.body;

  // Check current stock
  con.query("SELECT quantity FROM inventory WHERE name = ?", [name], (err, results) => {
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
    con.query(
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


// Billing history
// ✅ Route to save a bill
app.post("/api/save-bill", (req, res) => {
  const { billItems, totalAmount } = req.body;
  const billItemsJSON = JSON.stringify(billItems);  // Convert array to JSON

  const sql = "INSERT INTO bills (bill_items, total_amount) VALUES (?, ?)";
  db.query(sql, [billItemsJSON, totalAmount], (err, result) => {
    if (err) {
      console.error("Error saving bill:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Bill saved successfully", billId: result.insertId });
  });
});

// ✅ Route to fetch previous bills
app.get("/api/get-bills", (req, res) => {
  db.query("SELECT * FROM bills ORDER BY date DESC", (err, results) => {
    if (err) {
      console.error("Error fetching bills:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

const notifications = []; // Temporary storage

// Update inventory and trigger notification if stock is low
app.post("/api/update-inventory", (req, res) => {
  const { name, quantity } = req.body;

  con.query(
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
      con.query(
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

  con.query(query, (err, results) => {
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


// for user page data
// Fetch all users
app.get("/users", (req, res) => {
  con.query("SELECT * FROM user_data", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { name, role, email, phone } = req.body;
  if (!name || !role || !email || !phone) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  const query = "INSERT INTO user_data (name, role, email, phone) VALUES (?, ?, ?, ?)";
  con.query(query, [name, role, email, phone], (err, result) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ id: result.insertId, name, role, email, phone });
  });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { name, role, email, phone } = req.body;
  const { id } = req.params;

  const query = "UPDATE user_data SET name=?, role=?, email=?, phone=? WHERE id=?";
  con.query(query, [name, role, email, phone, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "User updated successfully" });
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  con.query("DELETE FROM user_data WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

