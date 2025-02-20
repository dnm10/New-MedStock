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


// GET all orders
app.get('/api/orders', (req, res) => {
  con.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching orders');
    }
    res.json(results);
  });
});

// ADD new order
app.post('/api/orders', (req, res) => {
  const { SupplierID, OrderQuantity, OrderDate, DeliveryStatus, ExpectedDeliveryDate } = req.body;

  if (!SupplierID || !OrderQuantity || !OrderDate || !DeliveryStatus || !ExpectedDeliveryDate) {
    return res.status(400).send('All fields are required');
  }

  const query = `
    INSERT INTO orders (SupplierID, OrderQuantity, OrderDate, DeliveryStatus, ExpectedDeliveryDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(
    query,
    [SupplierID, OrderQuantity, OrderDate, DeliveryStatus, ExpectedDeliveryDate],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error adding new order');
      }
      res.status(201).json({
        OrderID: result.insertId,
        SupplierID,
        OrderQuantity,
        OrderDate,
        DeliveryStatus,
        ExpectedDeliveryDate,
      });
    }
  );
});

// UPDATE delivery status of order
app.put('/api/orders/:id', (req, res) => {
  const { DeliveryStatus } = req.body;
  const { id } = req.params;

  if (!DeliveryStatus) {
    return res.status(400).send('DeliveryStatus is required');
  }

  const query = 'UPDATE orders SET DeliveryStatus = ? WHERE OrderID = ?';

  con.query(query, [DeliveryStatus, id], (err) => {
    if (err) {
      return res.status(500).send('Error updating order');
    }
    res.json({ OrderID: id, DeliveryStatus });
  });
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE OrderID = ?';

  con.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Error deleting order');
    }
    res.status(200).send(`Order with ID ${id} deleted successfully`);
  });
});



