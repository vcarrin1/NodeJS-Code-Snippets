const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
let storage;

if (process.env.NODE_ENV === 'local') {
    storage = new Storage({
        projectId: 'local-project-id',
        apiEndpoint: 'http://localhost:4443',
    });  

} else {
    storage = new Storage();
}

module.exports = storage;

/**
 * Upload a file as buffer to Google Cloud Storage bucket.
 * @param {Buffer} buffer - The buffer to upload.
 * @param {string} bucketPath - The destination path in the bucket.
 * @param {string} bucketName - The name of the bucket (default: 'media_assets').
 */
module.exports.uploadBufferToBucket = async (buffer, bucketPath, bucketName = process.env.DEFAULT_BUCKET_NAME) => {
    log(`Uploading buffer to bucket ${bucketName} at path ${bucketPath}`);
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(bucketPath);
    const options = {
        resumable: false,
        metadata: {
            contentType: 'application/octet-stream',
        },
    };
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('The provided buffer is not a valid Buffer instance.');
    }
    await file.save(buffer, options);
    console.log(`Buffer uploaded to ${bucketPath}`);
    return file;
};

/** 
    * Upload a file to Google Cloud Storage bucket.
    * @param {string} filePath - The path to the file to upload.
    * @param {string} bucketPath - The destination path in the bucket.
    * @param {string} bucketName - The name of the bucket (default: 'media-assets').
 */
module.exports.uploadFileToBucket = async (filePath, bucketPath, bucketName = process.env.DEFAULT_BUCKET_NAME) => {
    log(`Uploading file ${filePath} to bucket ${bucketName} at path ${bucketPath}`);
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(bucketPath);
    const options = {
        resumable: false,
        metadata: {
            contentType: 'application/octet-stream',
        },
    };
    await bucket.upload(filePath, { destination: file, ...options });
    console.log(`File ${filePath} uploaded to ${bucketPath}`);
    return file;
}

/**
 * Rename a folder in Google Cloud Storage media_assets bucket.
 * @param {string} oldPath - The original folder path.
 * @param {string} newPath - The new folder path.
 */
module.exports.copyFileToNewPath = async (req, res) => {
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
      res.status(400).send({ success: false, error: 'No body provided.' });
      return;
    }
    const { oldPath, newPath, bucketName = process.env.DEFAULT_BUCKET_NAME } = body || {};
  
    // Validate required fields
    if (!oldPath || !newPath) {
      res.status(400).send({
        success: false,
        error: 'Missing required fields: oldPath or newPath.'
      });
      return;
    }
  
    try {
      const bucket = storage.bucket(bucketName);
  
      // List all files in the source bucket
      const [files] = await bucket.getFiles({ prefix: oldPath + '/' });
  
      if (!files || files.length === 0) {
        res.status(404).send({ success: false, error: `No files found under the specified ${oldPath}.` });
        return;
      }
  
      // Copy each file to the new path
      for (const file of files) {
        const oldFileName = file.name;
        const newFileName = oldFileName.replace(oldPath, newPath);
  
        console.log(`Moving file: ${oldFileName} -> ${newFileName}`);
        await bucket.file(oldFileName).move(newFileName);
      }
      res.json({ success: true, message: `All files moved from ${oldPath} to ${newPath}.` });
    } catch (err) {
      console.error('Error moving files:', err.message);
      res.status(500).json({ success: false, error: `Bucket ${oldPath} - ${err.message}` });
    }
  };