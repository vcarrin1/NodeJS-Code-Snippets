const { CloudTasksClient } = require('@google-cloud/tasks');
const { credentials } = require('@grpc/grpc-js');

let client;

// Create a client
if (process.env.NODE_ENV === 'local') {
    console.log('Using local Cloud Tasks client');
    client = new CloudTasksClient({ 
        sslCreds: credentials.createInsecure(),
        servicePath: 'localhost',
        port: 9090
    });
    
} else {
    // Production configuration (auto-detects credentials)
    client = new CloudTasksClient();
}

// Define the project, location, and queue
const project = process.env.PROJECT_ID;
const location = 'us-central1';
const queue = 'image-queue';

// Construct the fully qualified queue name
const queuePath = client.queuePath(project, location, queue);

// Function to create a task
// createTask({ message: 'Hello, Cloud Tasks!' });
module.exports.createTask = async (payload) => {
    const task = {
        httpRequest: {
            httpMethod: 'POST',
            // url: 'http://host.docker.internal:3000/cloud-storage/process-image', // send to endpoint running in this app
            url: 'http://host.docker.internal:8081/processImage', // send to cloud function
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

// Function to list tasks
// listTasks('image-queue', 'us-central1');
module.exports.listTasks = async () => {
    try {
        const [tasks] = await client.listTasks({ parent: queuePath });
        console.log('Active tasks:');
        tasks.forEach(task => {
            console.log(`- ${task.name}`);
        });
        return tasks;
    } catch (error) {
        console.error('Error listing tasks:', error);
        throw error;
    }
};

// Function to delete a task
// deleteTask('task-name');
module.exports.deleteTask = async (taskName) => {
    const taskPath = client.taskPath(project, location, queue, taskName);

    try {
        await client.deleteTask({ name: taskPath });
        console.log(`Task deleted: ${taskName}`);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
