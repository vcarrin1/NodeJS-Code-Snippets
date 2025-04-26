const express = require('express');
const bodyParser = require('body-parser');

const cloudTasksRouter = require('./google-cloud-provider/cloud-tasks-router');
const cloudStorageRouter = require('./google-cloud-provider/cloud-storage-router');
const pubSubRouter = require('./google-cloud-provider/pub-sub-router');

// Import the Express module

// Create an instance of an Express application
const app = express();

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse application/json
app.use(bodyParser.json());

// Define a simple GET endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/cloud-storage', cloudStorageRouter);
app.use('/cloud-tasks', cloudTasksRouter);
app.use('/pub-sub', pubSubRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});