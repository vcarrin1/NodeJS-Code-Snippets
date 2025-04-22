const express = require('express');
const multer = require('multer');
const { uploadBufferToBucket, uploadFileToBucket, copyFileToNewPath } = require('./google-cloud-provider/cloud-storage');
const bodyParser = require('body-parser');
const path = require('path');

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
    res.send(`File ${file.name} uploaded successfully.`);
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});