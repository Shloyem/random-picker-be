// Run server by command: node server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Store for links and their results
const store = {};

// Generate a unique ID
function generateUniqueId() {
  // Generate a random component
  const randomPart = Math.random().toString(36).substring(2, 10);

  // Get the current timestamp
  const timestamp = Date.now().toString(36);

  // Concatenate timestamp and random part
  return timestamp + randomPart;
}

// Endpoint to create a new random selection
app.post('/create', (req, res) => {
  const { options } = req.body;
  const id = generateUniqueId();
  console.log("id %s", id);
  store[id] = {
    options,
    result: null,
    expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000 //  24 hours from now
  };
  res.json({ id });
});

// Endpoint to get the result
app.get('/result/:id', (req, res) => {
  const { id } = req.params;
  const entry = store[id];
  if (!entry) {
    console.log('Returned 404 Not found');
    return res.status(404).send('Not found');
  }
  if (new Date().getTime() > entry.expiresAt) {
    delete store[id];
    console.log(`Deleted id ${id} after expired`);
    return res.status(404).send('Link expired');
  }
  if (!entry.result) {
    // Generate a random result
    entry.result = entry.options[Math.floor(Math.random() * entry.options.length)];
  }

  console.log("entry.result: ", entry.result);
  res.json({ result: entry.result });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
