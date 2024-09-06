# Airline Ticket MIS

## Overview

A Management Information System for managing airline ticket bookings.

## Getting Started

### Frontend Client (Vite + React)

1. Navigate to the `client` folder: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend Server (Express)

1. Navigate to the `server` folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file for environment variables (e.g., `PORT=5000`)
4. Start the server: `npm start` (production) or `npm run dev` (development with nodemon)

## Packages installed for your reference:

### Frontend

- **React**: JavaScript library for building user interfaces
- **react-router-dom**: Routing library for React applications with multiple pages

### Backend

- **Express**: Web framework for Node.js
- **dotenv**: Loads environment variables from a `.env` file
- **nodemon**: Automatically restarts the server during development
- **cors**: To enable testing of backend server during development otherwise fetch() doesn't work

## Folder Structure

- `client/` - Frontend code using Vite and React
- `server/` - Backend code using Express
