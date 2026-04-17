# Smart Attendance System (SAS)

A sleek, state-of-the-art web application for marking automated attendance using Face Recognition via `face-api.js`. Built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS.

## Features
- **Face Recognition Attendance:** Automatically mark attendance using a live webcam feed.
- **Student Enrollment:** Capture student's face data directly and extract embeddings instead of storing images.
- **Live Administration Dashboard:** View active sessions, stats, and real-time logs.
- **Attendance Records:** Export to CSV immediately.
- **Beautiful UI:** Polished Tailwind CSS application.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

## Installation

1. **Clone or Download the Repository:**
   Provide the files in their respective folders: `/client` and `/server`.

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   *Edit `.env` inside `/server` if you want to use a different MongoDB URI or Port.*
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/smart_attendance
   JWT_SECRET=supersecret123
   ```
   Start the backend:
   ```bash
   npm start # or 'node index.js'
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## Setup Models (Automated)
The Face-API requires weights to run models correctly. In this workspace, they have been automatically downloaded to `/client/public/models/`. You can use `node scripts/download-models.js` from the root directory to download them again if needed.

## First Time Usage
1. Use an API tester like Postman to POST an admin account to `http://localhost:5000/api/auth/register` (email, password, name).
2. Login through the web interface.
3. Use Postman to POST a subject `http://localhost:5000/api/subjects` (name, code).
4. Use the interface to register a student with Face ID.
5. Create a session `http://localhost:5000/api/sessions` mapping to the subject.
6. Open the Scanner and magic will happen asynchronously!
