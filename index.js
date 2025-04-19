const express = require('express');

// Import the Express module

// Create an instance of an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple GET endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});