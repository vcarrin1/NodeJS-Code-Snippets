const fs = require('fs');
const path = require('path');
const { uploadBufferToBucket } = require('./google-cloud-provider/cloud-storage');

// Ensure the uploadBufferToBucket.js file is copied to the correct location before deployment
// This is done by the predeploy script in package.json
// Write the uploadBufferToBucket method to a new file
const uploadBufferToBucketStr = `
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

module.exports.uploadBufferToBucket = ${uploadBufferToBucket.toString()};
`;
try {
    fs.writeFileSync(
        path.join(__dirname, 'google-cloud-provider', 'cloud-functions', 'process-image', 'uploadBufferToBucket.js'),
        uploadBufferToBucketStr
    );
    console.log('uploadBufferToBucket.js copied successfully');
} catch (err) {
    console.error('Error copying uploadBufferToBucket.js:', err);
}
