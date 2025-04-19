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