const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const con = require('./connections'); // Import the MySQL connection

const app = express();
const port = 5000;

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
app.delete('/api/inventory/:id', (req, res) => {  // Changed to lowercase 'inventory'
  const query = 'DELETE FROM inventory WHERE id = ?';

  con.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting item');
    }
    res.status(200).send('Item deleted');
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

// GET all orders
app.get('/api/orders', (req, res) => {
  con.query('SELECT * FROM Orders', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(results);
  });
});

// ADD new order
app.post('/api/orders', (req, res) => {
  const { MedicineName, QuantityOrdered, Price, DeliveryDate, SupplierID } = req.body;

  // Check if all required fields are provided
  if (!MedicineName || !QuantityOrdered || !Price || !DeliveryDate || !SupplierID) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert order into database
  const query = `
    INSERT INTO Orders (MedicineName, QuantityOrdered, Price, DeliveryDate, SupplierID)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(query, [MedicineName, QuantityOrdered, Price, DeliveryDate, SupplierID], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding new order', error: err });
    }

    // Fetch the newly inserted order using the inserted OrderID
    con.query('SELECT * FROM Orders WHERE OrderID = ?', [result.insertId], (fetchErr, fetchResults) => {
      if (fetchErr) {
        return res.status(500).json({ message: 'Error fetching new order', error: fetchErr });
      }

      res.status(201).json(fetchResults[0]); // Send the new order details to frontend
    });
  });
});


// UPDATE order delivery status
app.put('/api/orders/:id', (req, res) => {
  const { Delivery_Status } = req.body;
  const { id } = req.params;

  if (Delivery_Status === undefined) {
    return res.status(400).json({ message: 'Delivery status is required' });
  }

  const query = 'UPDATE Orders SET Delivery_Status = ? WHERE OrderID = ?';

  con.query(query, [Delivery_Status, id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating order' });
    }
    res.json({ message: 'Order status updated successfully', OrderID: id });
  });
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Orders WHERE OrderID = ?';

  con.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting order' });
    }
    res.json({ message: `Order with ID ${id} deleted successfully` });
  });
});


// ======================= SUPPLIERS =========================== //

// GET all suppliers
app.get('/api/suppliers', (req, res) => {
  con.query('SELECT * FROM Suppliers', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching suppliers' });
    }
    res.json(results);
  });
});

// ADD a new supplier
app.post('/api/suppliers', (req, res) => {
  const { SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate } = req.body;

  if (!SupplierName || !ContactPerson || !PhoneNumber || !EmailAddress || !Address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO Suppliers (SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  con.query(
    query,
    [SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding supplier' });
      }
      res.status(201).json({
        SupplierID: result.insertId,
        SupplierName,
        ContactPerson,
        PhoneNumber,
        EmailAddress,
        Address,
        LastDeliveryDate,
      });
    }
  );
});

// UPDATE a supplier
app.put('/api/suppliers/:id', (req, res) => {
  const { SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate } = req.body;
  const { id } = req.params;

  if (!SupplierName || !ContactPerson || !PhoneNumber || !EmailAddress || !Address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    UPDATE Suppliers 
    SET SupplierName = ?, ContactPerson = ?, PhoneNumber = ?, EmailAddress = ?, Address = ?, LastDeliveryDate = ?
    WHERE SupplierID = ?
  `;

  con.query(
    query,
    [SupplierName, ContactPerson, PhoneNumber, EmailAddress, Address, LastDeliveryDate || null, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating supplier' });
      }
      res.json({ message: 'Supplier updated successfully' });
    }
  );
});

// DELETE a supplier
app.delete('/api/suppliers/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Suppliers WHERE SupplierID = ?';

  con.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting supplier' });
    }
    res.json({ message: `Supplier with ID ${id} deleted successfully` });
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




