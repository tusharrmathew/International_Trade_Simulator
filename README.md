# TradeSphere - Global Trade Simulation

TradeSphere is an interactive global trade simulation app designed for students, educators, and enthusiasts to understand the complexities of international trade, tariffs, economic policies, and diplomatic negotiations.

## Features

- Customizable Nations & Trade Blocs
- Dynamic Trade Policies
- Resource Management
- Economic Strategies & Diplomacy
- Real-time Analytics & Scoreboard
- Educational & Competitive Modes

## Tech Stack

- Frontend: React Native
- Backend: Node.js with Express
- Database: MongoDB
- Real-time Communication: WebSocket
- Data Visualization: D3.js

## Project Structure

```
tradesphere/
├── client/                 # React Native frontend
├── server/                 # Node.js backend
├── shared/                 # Shared types and utilities
└── docs/                   # Documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend app
   cd ../client
   npm start
   ```
