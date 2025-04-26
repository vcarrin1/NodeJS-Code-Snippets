const express = require('express');
const router = express.Router();
const { publishMessage, subscribe, createTopic, listAllTopics, createSubscription } = require('./pub-sub');

router.post('/publish-message', async (req, res) => {
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

router.post('/subscribe', async (req, res) => {
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

router.get('/list-topics', async (req, res) => {
    try {
        // Call the listAllTopics function from the Google Cloud Pub/Sub
        const topics = await listAllTopics();
        res.json(topics);
    } catch (error) {
        console.error(`Error listing topics: ${error.message}`);
        res.status(500).send('Error listing topics.');
    }
});

router.post('/create-topic', async (req, res) => {
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

router.post('/create-subscription', async (req, res) => {
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

module.exports = router;