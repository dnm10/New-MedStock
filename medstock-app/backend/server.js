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
