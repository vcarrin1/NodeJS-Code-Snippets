const { CloudTasksClient } = require('@google-cloud/tasks');
const { credentials } = require('@grpc/grpc-js');

let client;

// Create a client
if (process.env.NODE_ENV === 'local') {
    console.log('Using local Cloud Tasks client');
    client = new CloudTasksClient({ 
        sslCreds: credentials.createInsecure(),
        projectId: 'local-project-id',
        apiEndpoint: 'localhost:9090',
        clientConfig: {
            'grpc.max_receive_message_length': 100 * 1024 * 1024, // 100 MB
            'grpc.max_send_message_length': 100 * 1024 * 1024, // 100 MB
        }, 
    });
    
} else {
    // Production configuration (auto-detects credentials)
    client = new CloudTasksClient();
}

// Define the project, location, and queue
const project = process.env.PROJECT_ID;
const location = 'us-central1';
const queue = 'images-queue';

// Construct the fully qualified queue name
const queuePath = client.queuePath(project, location, queue);

// Function to create a task
// createTask({ message: 'Hello, Cloud Tasks!' });
module.exports.createTask = async (payload) => {
    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url: `${process.env.APP_BASE_URL}/api/process-image`,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    };

    try {
        const [response] = await client.createTask({ parent: queuePath, task });
        console.log(`Task created: ${response.name}`);
    } catch (error) {
        console.error('Error creating task:', error);
    }
}
