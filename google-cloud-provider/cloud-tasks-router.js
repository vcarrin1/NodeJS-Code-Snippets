const express = require('express');
const router = express.Router();

const { listTasks, deleteTask } = require('./cloud-tasks');

/**
 * Get all active tasks from Cloud Tasks.
 * @param {string} queueName - The name of the queue.
 * @param {string} location - The location of the queue.
 * @return {Promise} - A promise that resolves to the list of tasks.
 * example: {
 *   "queueName": "image-queue",
 *   "location": "us-central1"
 * }
 */
router.get('/list-cloud-tasks', async (req, res) => {
    const { queueName, location } = req.body;

    if (!queueName || !location) {
        return res.status(400).send('Queue name and location are required.');
    }

    try {
        // Call the listTasks function to retrieve active tasks
        const tasks = await listTasks(queueName, location);
        const response = tasks.map(task => ({
            name: task.name,
            httpRequest: task.httpRequest.url,
            scheduleTime: task.scheduleTime,
            createTime: task.createTime
        }));
        res.json(response);
    } catch (error) {
        console.error(`Error retrieving tasks: ${error.message}`);
        res.status(500).send('Error retrieving tasks.');
    }
});

/**
 * Delete a task from Cloud Tasks.
 * @param {string} taskName - The name of the task to delete.
 * @param {string} queueName - The name of the queue.
 * @param {string} location - The location of the queue.
 * @return {Promise} - A promise that resolves when the task is deleted.
 * example: {
 *   "taskName": "task-id",
 *   "queueName": "image-queue",
 *   "location": "us-central1"
 * }
 */
router.delete('/delete-task', async (req, res) => {
    const { taskName, queueName, location } = req.body;

    if (!taskName || !queueName || !location) {
        return res.status(400).send('Task name, queue name, and location are required.');
    }    

    try {
        // Call the deleteTask function to delete the specified task
        await deleteTask(taskName, queueName, location);
        console.log(`Task ${taskName} deleted successfully.`);
        res.send(`Task ${taskName} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting task: ${error.message}`);
        res.status(500).send('Error deleting task.');
    }
});

module.exports = router;