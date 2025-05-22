
# Todo API 

This is a simple and secure Todo App that allows users to manage daily tasks efficiently. It supports user authentication (signup/login) and enables users to create, view, update and delete todos. The backend is built with Node.js, Express, MongoDB, and includes JWT-based authentication and input validation. It’s ideal for developers exploring REST API design, JWT auth, and CRUD operations using JavaScript frameworks.


## Features

- User Signup & Login with JWT Authentication
- Todo CRUD Operations (Create, Read, Update, Delete)
- Protected Routes with Middleware
- Input Validation
- API Documentation via Swagger
- Cron Jobs {marks expired todos as completed every midnight using a scheduled cron job.}
- Modular, Scalable Project Structure


## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT for Auth
- Swagger for Docs
- dotenv for Env Config


## Project Structure

todo-app/
├── node_modules/
├── src/
│ ├── config/ # Configuration (e.g., DB, constants)
│ ├── controllers/ # Request handlers
│ ├── cron/ # Scheduled tasks
│ ├── middlewares/ # Validation & authentication
│ ├── models/ # Mongoose schemas/models
│ ├── routes/ # API route definitions
│ ├── utils/ # Utility functions (e.g., JWT helper, error handler)
│ ├── app.ts # Express app setup
│ └── server.ts # Server bootstrap file
├── .env # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json # TypeScript config
├── README.md # Project documentation
└── LICENSE

## Installation

```bash
# Clone the repository
git clone https://github.com/Ishi1111/todo-app

# Navigate to project directory
cd todo-app

# Install dependencies
npm install
```

## Configuration

Create a .env file in the root directory and add the following:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

# Start the server

```bash
npm run dev
```

## API Endpoints

Base URL: http://localhost:5000/api

Auth
- POST /auth/signup – Register a new user
- POST /auth/login – Login and receive a JWT

Todos (Protected Routes)
- GET /todo – Get list of todos
- GET /todo/:id – Get a todo by ID
- POST /todo – Create a new todo
- PUT /todo/:id – Update a todo
- DELETE /todo/:id – Delete a todo

Use the Authorization: Bearer <token> header for protected routes.


## API Docs

Swagger UI is available at:
```bash
http://localhost:5000/api-docs
```

## License

[MIT](https://choosealicense.com/licenses/mit/)