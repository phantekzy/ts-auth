#  Authentication System

A secure authentication API built with Express, Drizzle ORM, and PostgreSQL. This project focuses on a straightforward implementation of database-backed session management to handle user identity.

## Features

- Password Hashing: Uses Argon2id for password security.
- Session Management: Sessions are stored in PostgreSQL, allowing for server-side revocation and logout.
- Security: Implements HttpOnly, Secure, and SameSite cookie attributes.
- Type Safety: Built with TypeScript and Drizzle ORM for schema-to-code synchronization.
- Modern Stack: Utilizes Node.js ES Modules and Express 5.

## Tech Stack

- Runtime: Node.js (v20+)
- Framework: Express.js
- Database: PostgreSQL
- ORM: Drizzle ORM
- Auth: Argon2 (Hashing) & Node-Crypto (Session Generation)
- Environment: dotenv

## Prerequisites

- PostgreSQL installed and running.
- Node.js installed.
- Postman (for testing).

## Installation

1. Clone the repository:
   git clone <your-repo-url>
   cd server

2. Install dependencies:
   npm install

3. Configure environment variables:
   Create a .env file in the server root. DO NOT commit this file to version control.
   PORT=your_private_port
   DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name

4. Push the schema to your database:
   npx drizzle-kit push

## Running the Project

To start the server in development mode with hot-reloading:
npx tsx watch src/index.ts

The server will be available at: http://localhost:[your_port]

## API Endpoints

### Authentication

- POST /auth/signup: Create a new user account.
  Body: { "email": "user@example.com", "password": "password123" }

- POST /auth/login: Authenticate and receive a session cookie.
  Body: { "email": "user@example.com", "password": "password123" }

- POST /auth/logout: Invalidate the current session and clear cookies.

## Project Structure

- src/index.ts: Application entry point and middleware configuration.
- src/routes/auth.ts: Authentication logic and endpoint definitions.
- src/db/schema.ts: Database table definitions (Users & Sessions).
- src/db/index.ts: Database connection and Drizzle initialization.

## Database Management

To view your data in a graphical interface, run:
npx drizzle-kit studio
