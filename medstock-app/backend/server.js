const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const con = require('./connection'); // Import the MySQL connection

const app = express();
const port = 3002;

// Middleware
app.use(cors());
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
app.get('/Inventory', (req, res) => {
  con.query('SELECT * FROM Inventory', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching inventory');
    }
    res.json(results);
  });
});

// Add new inventory item
app.post('/Inventory', (req, res) => {
  const { ItemID, ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate } = req.body;
  const query = 'INSERT INTO Inventory (ItemID, ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?)';
  
  con.query(query, [ItemID, ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding new item');
    }
    res.status(201).json({
      ItemID, ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate
    });
  });
});

// Update inventory item
app.put('/Inventory/:id', (req, res) => {
  const { ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate, ReorderStatus } = req.body;
  const query = 'UPDATE Inventory SET ItemName = ?, Category = ?, CurrentStock = ?, MinimumStockLevel = ?, ExpiryDate = ?, ReorderStatus = ? WHERE ItemID = ?';

  con.query(query, [ItemName, Category, CurrentStock, MinimumStockLevel, ExpiryDate, ReorderStatus, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send('Error updating item');
    }
    res.json({
      ItemID: req.params.id,
      ItemName,
      Category,
      CurrentStock,
      MinimumStockLevel,
      ExpiryDate,
      ReorderStatus
    });
  });
});

// Delete inventory item
app.delete('/Inventory/:id', (req, res) => {
  const query = 'DELETE FROM Inventory WHERE ItemID = ?';
  
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
