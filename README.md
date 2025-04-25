# NodeJS-Code-Snippets
Code examples using NodeJS

## Cloud Storage
Cloud Storage allows you to store and retrieve files in a scalable and secure manner. It is commonly used for storing media assets, backups, and other large datasets.

### Example Use Case:
To view the contents of a cloud storage bucket in your browser, you can use the following endpoint:
```
http://localhost:4443/storage/v1/b/<bucket-name>/o
```
Replace `<bucket-name>` with the name of your storage bucket to access its contents.

<details>
<summary>Endpoints</summary>

### Description


#### 1. Uploads a file
**Endpoint:** `POST /api/upload`  
**Description:** Uploads a file as a buffer to the Google Cloud Storage bucket `media-assets`. The file is processed and stored in the specified bucket path, and a cloud task is created with the file's base64-encoded content.
**Middleware**: `upload.single('file')` (expects a file field named `file` in the request)

### Request Body
- **file**: The file to be uploaded (binary data).


#### 2. Rename a folder in Google Cloud Storage media_assets bucket.
**Endpoint:** `POST /api/copyFileToNewPath`
**Description:** This endpoint is responsible for copying a file from its current location to a new specified path.

**Request Body:**
```json
{
    "oldPath": "string",
    "newPath": "string"
}
```

</details>


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

#### 3. List All Topics
**Endpoint:** `GET /api/list-topics`  
**Description:** Retrieves a list of all topics.  

#### 4. Create a Topic
**Endpoint:** `POST /api/create-topic`  
**Description:** Creates a new topic.  
**Query Parameters:**
- `topicName` (required): The name of the topic to create.

#### 5. Create a Subscription
**Endpoint:** `POST /api/create-subscription`  
**Description:** Creates a subscription for a specified topic.  
**Query Parameters:**
- `topicName` (required): The name of the topic.
- `subscriptionName` (required): The name of the subscription.

</details>
