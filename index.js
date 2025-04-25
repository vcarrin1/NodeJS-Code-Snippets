const express = require('express');
const multer = require('multer');
const { uploadBufferToBucket, uploadFileToBucket, copyFileToNewPath } = require('./google-cloud-provider/cloud-storage');
const bodyParser = require('body-parser');
const path = require('path');
const { publishMessage, subscribe, createTopic, createSubscription, listAllTopics } = require('./google-cloud-provider/pub-sub');
const { createTask } = require('./google-cloud-provider/cloud-tasks');

// File filter for multer
const fileFilter = (req, file, cb) => {
    // Accept only specific file types (e.g., images)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject the file
    }
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter });

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

/**
 * Upload a file as buffer to Google Cloud Storage media_assets bucket.
 * @param {string} filePath - The path to the file to upload.
 * @param {string} bucketPath - The destination path in the bucket.
 * @param {string} bucketName - The name of the bucket (default: 'media-assets').
 * @returns {Promise} - A promise that resolves when the file is uploaded.
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // req.file contains the file data in buffer format
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    // Simulate file upload
    const file = await uploadBufferToBucket(fileBuffer, 'shermans/' + fileName);
    // send image to cloud task
    const base64Image = fileBuffer.toString('base64');
    await createTask({ fileName, base64Image });
    // Log the file name and size
    console.log(`File uploaded: ${fileName} (${fileBuffer.length} bytes)`);
    res.send(`File ${file.name} uploaded successfully.`);
});

/**
 * Process an image from a Cloud Task.
 * @param {Object} req - The request object containing the task payload.
 * @param {Object} res - The response object.
 */
app.post('/api/process-image', async (req, res) => {
    const { fileName, base64Image } = req.body;

    if (!fileName || !base64Image) {
        return res.status(400).send('File name and base64 image data are required.');
    }

    try {
        // Decode the base64 image
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Simulate image processing (e.g., resizing, filtering, etc.)
        console.log(`Processing image: ${fileName} (${imageBuffer.length} bytes)`);

        // Example: Save the processed image to a new path in the bucket
        const processedFileName = `processed/${fileName}`;
        await uploadBufferToBucket(imageBuffer, processedFileName);

        res.send(`Image ${fileName} processed and saved as ${processedFileName}.`);
    } catch (error) {
        console.error(`Error processing image: ${error.message}`);
        res.status(500).send('Error processing image.');
    }
});

/**
 * Rename a folder in Google Cloud Storage media_assets bucket.
 * @param {string} oldPath - The original folder path.
 * @param {string} newPath - The new folder path.
 * @param {string} bucketName - The name of the bucket (default: 'media-assets').
 * @returns {Promise} - A promise that resolves when the folder is renamed.
 * example: {
 *    "oldPath": "old-folder-name",
 *    "newPath": 'new-folder-name'  
 * }   
 */
app.post('/api/copyFileToNewPath', copyFileToNewPath);

app.post('/api/publish-message', async (req, res) => {
    const { topicName, data } = req.body;

    if (!topicName || !data) {
        return res.status(400).send('Topic name and data are required.');
    }

    try {
        // Call the publishMessage function from the Google Cloud Pub/Sub module
        await publishMessage(topicName, data);
        res.send(`Message published to topic ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message: ${error.message}`);
        res.status(500).send('Error publishing message.');
    }
});

app.post('/api/subscribe', async (req, res) => {
    const { topicName, subscriptionName } = req.body;

    if (!topicName || !subscriptionName) {
        return res.status(400).send('Topic name and subscription name are required.');
    }

    try {
        // Call the subscribe function from the Google Cloud Pub/Sub
        await subscribe(topicName, subscriptionName);
        
        res.send(`Subscribed to topic ${topicName} with subscription ${subscriptionName}.`);
    } catch (error) {
        console.error(`Error subscribing: ${error.message}`);
        res.status(500).send('Error subscribing.');
    }
});

app.get('/api/list-topics', async (req, res) => {
    try {
        // Call the listAllTopics function from the Google Cloud Pub/Sub
        const topics = await listAllTopics();
        res.json(topics);
    } catch (error) {
        console.error(`Error listing topics: ${error.message}`);
        res.status(500).send('Error listing topics.');
    }
});
app.post('/api/create-topic', async (req, res) => {
    const { topicName } = req.query;

    if (!topicName) {
        return res.status(400).send('Topic name is required.');
    }

    try {
        // Call the createTopic function from the Google Cloud Pub/Sub
        await createTopic(topicName);
        res.send(`Topic ${topicName} created successfully.`);
    } catch (error) {
        console.error(`Error creating topic: ${error.message}`);
        res.status(500).send(`Error creating topic: ${error.message}`);
    }
});

app.post('/api/create-subscription', async (req, res) => {
    const { topicName, subscriptionName } = req.query;

    if (!topicName || !subscriptionName) {
        return res.status(400).send('Topic name and subscription name are required.');
    }

    try {
        // Call the createSubscription function from the Google Cloud Pub/Sub
        await createSubscription(topicName, subscriptionName);
        res.send(`Subscription ${subscriptionName} created successfully for topic ${topicName}.`);
    } catch (error) {
        console.error(`Error creating subscription: ${error.message}`);
        res.status(500).send(`Error creating subscription: ${error.message}`);
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});