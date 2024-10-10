# Airline Ticket MIS

## Overview

A Management Information System for managing airline ticket bookings.

## Getting Started

### Frontend Client (Vite + React)

1. Navigate to the `client` folder: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file for environment variables based on `.env.example`.
4. Start the development server: `npm run dev`

### Backend Server (Express + TypeScript)

1. Navigate to the `server` folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file for environment variables (refer to `.env.example` for required variables like `DB_USER`, `DB_PASSWORD`, etc.).
4. Start the server: `npm start` (production) or `npm run dev` (development with nodemon)

## Database Setup (PostgreSQL) (Local setup hosting soon...)

1. Install PostgreSQL on your local machine.
2. Create a database named `airline_ticketing_system`.
3. Use the schema file in the `server` folder (`schema.sql`) to create the `users` table for initial testing:
   ```bash
   psql -U postgres -d airline_ticketing_system -f server/schema.sql
   ```

## Packages Installed for reference:

### Frontend

- **React**: JavaScript library for building user interfaces
- **react-router-dom**: Routing library for React applications with multiple pages
- **react-icons**: Icon library for React
- **tailwindcss**: Utility-first CSS framework for faster styling
- **prettier-plugin-tailwindcss**: Formats Tailwind classes with Prettier
- **shadcn components**: Provides pre-built components with extensive customisability if needed

### Backend

- **Express**: Web framework for Node.js
- **TypeScript**: Typed superset of JavaScript
- **ts-node**: TypeScript execution environment for Node.js
- **bcryptjs**: Password hashing utility for securely storing user passwords
- **jsonwebtoken (JWT)**: For user authentication and authorization
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Loads environment variables from a `.env` file
- **cookie-parser**: Middleware to parse cookies in requests
- **nodemon**: Automatically restarts the server during development
- **cors**: Enables cross-origin requests for API access during development

## Folder Structure

- `client/` - Frontend code using Vite and React
- `server/` - Backend code using Express and TypeScript
- `server/src/` - Contains TypeScript source files for the backend logic
- `server/schema.sql` - SQL script to create the initial `users` table for testing purposes