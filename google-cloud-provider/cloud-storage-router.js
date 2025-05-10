const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadBufferToBucket, copyFileToNewPath } = require('./cloud-storage');
const { createTask } = require('./cloud-tasks');

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

/**
 * Upload a file to Cloud Tasks.
 * @param {Object} req.file - The request object containing the file data.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // req.file contains the file data in buffer format
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const user = {
        full_name: 'Valentina Carrington',
        email: 'vcarrin87@gmail.com' 
    };
    // send image to cloud task
    const base64Image = fileBuffer.toString('base64');
    await createTask({ fileName, base64Image, user });
    // Log the file name and size
    console.log(`File sent to Cloud Task: ${fileName} (${fileBuffer.length} bytes)`);
    res.send(`File ${fileName} sent to Cloud Task.`);
});

/**
 * Process an image from a Cloud Task and upload to Cloud Storage.
 * @param {Object} req.body - The request body containing the file name and base64 image data.
 */
router.post('/process-image', async (req, res) => {
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
 * Rename a folder in Cloud Storage media_assets bucket.
 * @param {string} oldPath - The original folder path.
 * @param {string} newPath - The new folder path.
 * @param {string} bucketName - The name of the bucket (default: 'media-assets').
 * @returns {Promise} - A promise that resolves when the folder is renamed.
 * example: {
 *    "oldPath": "old-folder-name",
 *    "newPath": 'new-folder-name'  
 * }   
 */
router.post('/copyFileToNewPath', copyFileToNewPath);

module.exports = router;