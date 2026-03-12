# Library Management System API

A complete backend API for a university Library Management System built with Node.js, Express, and MongoDB.

## Features
- Full CRUD operations for Book records.
- Search books by title.
- Global error handling.
- Environment variable configuration.
- MongoDB integration with Mongoose validations.

## Prerequisites
- Node.js installed.
- MongoDB instance running (local or cloud).

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your MongoDB connection string:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

## Running the Server

- **Production Mode**:
  ```bash
  npm start
  ```
- **Development Mode** (with Nodemon):
  ```bash
  npm run dev
  ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books` | Add a new book |
| GET | `/books` | Get all book records |
| GET | `/books/:id` | Get book record by ID |
| PUT | `/books/:id` | Update book details |
| DELETE| `/books/:id` | Delete book record |
| GET | `/books/search?title=xyz` | Search books by title |

## Testing

A test script is provided in `scripts/test_api.js`. To run it:
1. Ensure the server is running (`npm run dev`).
2. Run the test script:
   ```bash
   node scripts/test_api.js
   ```

## Requirements Met

- **Node.js + Express + MongoDB + Mongoose**
- **Proper HTTP Status Codes** (200, 201, 400, 404, 500)
- **Async/Await** for all database operations.
- **Try-Catch** blocks in all controllers.
- **Error Handling Middleware** implemented.
