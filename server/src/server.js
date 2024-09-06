require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define your API routes
app.get('/test', (req, res) => {
  res.type('text/plain');
  res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
