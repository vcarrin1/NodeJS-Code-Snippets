const { PubSub } = require('@google-cloud/pubsub');
const gcpMetadata = require('gcp-metadata');

// Set the environment variable to point to the emulator
process.env.PUBSUB_EMULATOR_HOST = 'localhost:8085';
process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

// Creates a client
const pubSubClient = new PubSub();

// Function to publish a message to a topic
// publishMessage('your-topic-name', 'Hello, world!');
module.exports.publishMessage = async (topicName, data) => {
    const dataBuffer = Buffer.from(data);
    console.log(`Publishing message to topic ${topicName}: ${data}`);

    try {
        const isAvailable = await gcpMetadata.isAvailable();
        const projectId = await isAvailable ? await gcpMetadata.project('project-id') : process.env.PROJECT_ID;
        const messageId = await pubSubClient
            .topic(`projects/${projectId}/topics/${topicName}`)
            .publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Error publishing message: ${error.message}`);
    }
}

// Function to subscribe to a topic
// subscribe('your-topic-name', 'your-subscription-name');
module.exports.subscribe = async (topicName, subscriptionName) => {
    const subscription = pubSubClient.subscription(subscriptionName);

    subscription.on('message', message => {
        console.log(`Received message: ${message.data.toString()}`);
        message.ack();
    });

    subscription.on('error', error => {
        console.error(`Received error: ${error.message}`);
    });

    console.log(`Listening for messages on subscription: ${subscriptionName}`);
}
// Function to list all topics in the project
// listAllTopics();
module.exports.listAllTopics = async () => {
    // Lists all topics in the current project
    const [topics] = await pubSubClient.getTopics();
    // add topic name to array: ['projects/test-project/topics/test1','projects/test-project/topics/test2']
    const topicNames = topics.map(topic => topic.name);
    return topicNames;
}

// Function to create a topic
// createTopic('your-topic-name');
module.exports.createTopic = async (topicName) => {
    console.log(`Creating topic: ${topicName}`);
    try {
        await pubSubClient.createTopic(topicName);
        console.log(`Topic ${topicName} created successfully.`);
    } catch (error) {
        throw Error(error.message);
    }
}

// Function to create a subscription
// createSubscription('your-topic-name', 'your-subscription-name');
module.exports.createSubscription = async (topicName, subscriptionName) => {
    console.log(`Creating subscription: ${subscriptionName} for topic: ${topicName}`);
    try {
        await pubSubClient.topic(topicName).createSubscription(subscriptionName);
        console.log(`Subscription ${subscriptionName} created successfully.`);
    } catch (error) {
        throw Error(error.message);
    }
}