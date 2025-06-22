# Todolist With Authentication

This application is designed to help users create to-do lists securely. Our project uses Oauth and password-based authentication, a system known as multi-auth provider. it includes useful features such as tagging, checklist, and more.

## Tech Stack

- Node.js
- Express
- MongoDB
- Passport.js
- Jest
- Supertest
- Bcrypt
- Passport google oauth
- (and other supporting libraries)

## Features

- User authentication (login/register)
- Login with google
- Add, edit, mark, delete daily
- Secure password storage
- API documentation via Swagger

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add your MongoDB URI and any other required environment variables (see `.env.example` if available).

4. setup your mongodb and create database

   ```bash
   mongosh
   use todos
   ```

5. Copy url database and paste in env
6. Start the application:
   ```bash
   npm start
   # or
   node main.js
   ```

## API Documentation

- API endpoints are documented using Swagger.
- After running the app, access the Swagger UI at: `http://localhost:3000/api-docs` (adjust port if needed).

## Usage

- Interact with the API via Swagger UI or use the web interface if available.
- Register/login to manage your todos.

## Running Tests

- To run tests, use:
  ```bash
  npm test
  ```
  or
  ```bash
  pnpm test
  ```

## License

This project is licensed under the MIT License.
