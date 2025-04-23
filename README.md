# NodeJS-Code-Snippets
Code examples using NodeJS

## View cloud storage bucket in the browser
```
    http://localhost:4443/storage/v1/b/media_assets/o
```

## Pub/Sub
Pub/Sub (short for Publish/Subscribe) is a messaging pattern used in distributed systems to enable asynchronous communication between components. It decouples the producers (publishers) of messages from the consumers (subscribers), allowing them to operate independently.

Key Concepts: \
**Publisher**: The component that sends messages (events) to a topic. Publishers don't need to know who will consume the messages. \
**Subscriber**: The component that listens for messages from a topic. Subscribers don't need to know who published the messages. \
**Topic**: A named channel where messages are sent by publishers and received by subscribers.

<details>
<summary>Endpoints</summary>

#### 1. Publish a Message
**Endpoint:** `POST /api/publish-message`  
**Description:** Publishes a message to a specified topic.  
**Request Body:**
```json
{
    "topicName": "string",
    "data": "string"
}
```
**Responses:**
- `200 OK`: Message published successfully.
- `400 Bad Request`: Missing `topicName` or `data`.
- `500 Internal Server Error`: Error during publishing.

#### 2. Subscribe to a Topic
**Endpoint:** `POST /api/subscribe`  
**Description:** Subscribes to a topic with a given subscription name.  
**Request Body:**
```json
{
    "topicName": "string",
    "subscriptionName": "string"
}
```
**Responses:**
- `200 OK`: Subscribed successfully.
- `400 Bad Request`: Missing `topicName` or `subscriptionName`.
- `500 Internal Server Error`: Error during subscription.

#### 3. List All Topics
**Endpoint:** `GET /api/list-topics`  
**Description:** Retrieves a list of all topics.  
**Responses:**
- `200 OK`: Returns a JSON array of topics.
- `500 Internal Server Error`: Error during retrieval.

#### 4. Create a Topic
**Endpoint:** `POST /api/create-topic`  
**Description:** Creates a new topic.  
**Query Parameters:**
- `topicName` (required): The name of the topic to create.

**Responses:**
- `200 OK`: Topic created successfully.
- `400 Bad Request`: Missing `topicName`.
- `500 Internal Server Error`: Error during topic creation.

#### 5. Create a Subscription
**Endpoint:** `POST /api/create-subscription`  
**Description:** Creates a subscription for a specified topic.  
**Query Parameters:**
- `topicName` (required): The name of the topic.
- `subscriptionName` (required): The name of the subscription.

**Responses:**
- `200 OK`: Subscription created successfully.
- `400 Bad Request`: Missing `topicName` or `subscriptionName`.
- `500 Internal Server Error`: Error during subscription creation.

</details>
