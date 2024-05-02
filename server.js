require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 9000;

var cors = require('cors');

app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


// Example route to handle API requests
app.get('/api/data', (req, res) => {
  // Example data
  const data = {
    message: 'Hello from the server!',
    timestamp: Date.now(),
    apiKey: process.env.OPENAI_API_KEY,
    instructions: process.env.INSTRUCTIONS
  };
  res.json(data);
});

// Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
