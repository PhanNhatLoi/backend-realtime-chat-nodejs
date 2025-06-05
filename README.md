# Realtime Chat Server with Publisher-Subscriber Pattern

This is a **Realtime Chat Server** built with **Node.js**, **MongoDB**, and a **Publisher-Subscriber (Pub/Sub)** architecture for handling realtime messaging. Messages are published by publishers and received by subscribers for efficient message distribution.

---

## Technologies Used

- **Node.js** — JavaScript runtime for building the server
- **MongoDB** — NoSQL database for storing users and messages
- **Mongoose** — ODM for MongoDB
- **Pub/Sub system** — for real-time message broadcasting (e.g., Redis Pub/Sub, MQTT, or custom implementation)

---

## Features

- Real-time messaging using Publisher-Subscriber model
- Persistent message storage in MongoDB
- Scalable message distribution via Pub/Sub system
- Basic user connection and session management
- Message history retrieval

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud, e.g., MongoDB Atlas)
- Pub/Sub system setup (e.g., Redis server if using Redis Pub/Sub)

---

### Setup

1. Clone the repository

```bash
git clone https://github.com/PhanNhatLoi/backend-realtime-chat-nodejs.git
cd realtime-chat-server
```
Install dependencies (choose one)

```bash
npm install
or
```
```bash
yarn install
```
Create a .env file in the root directory and add your MongoDB connection string
```
CLOUD_URL =
CLOUD_API_SECRET =
CLOUD_API_KEY =
CLOUD_NAME =
MONGODB_URI =
pusher_appId =
pusher_key =
pusher_secret =
pusher_channel =
PORT =
DB_NAME =
CLIENT_URL =
REFRESH_TOKEN_SECRET =
ACCESS_TOKEN_SECRET =
```

Running the Server
Start the server with:

```bash
npm run start
or for development with auto-reload (if using nodemon):
```
```bash
npm run dev
```
By default, the server will run on http://localhost:3000.
## Demo: https://server-nodejs-iota.vercel.app/
