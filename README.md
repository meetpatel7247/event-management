# Event Management System

## Overview
A comprehensive full-stack web application designed for discovering, managing, and booking events. Built using a modern JavaScript stack featuring a React (Vite) frontend and an Express Node.js backend using an in-memory data store for simplified, lightweight local development.

## 🌟 Key Features
- **User Authentication**: Secure Login/Register flows with built-in role management (User, Organizer, Admin).
- **Event Discovery**: Browse dynamic categories ranging from Music & Concerts to Sports and Technical Workshops.
- **Ticket Booking**: Seamless seat reservation interface with immediate availability updates and error handling.
- **Role-based Dashboards**: Admins approve and govern events; Organizers create and track event statistics.
- **Special Offers**: Dynamic promotional pages outlining seasonal discounts and group bookings to encourage ticket sales.
- **Modern UI Edge**: Built with CSS Modules enforcing a dynamic, dark-mode aesthetic utilizing glassmorphism and smooth micro-animations.

## 🚀 Tech Stack
### Frontend (`/App`)
- React.js (Bootstrapped with Vite)
- Redux Toolkit (State Management)
- React Router DOM (Routing)
- CSS Modules & Vanilla CSS (Styling)
- React Toastify (Notifications)

### Backend (`/backend`)
- Node.js
- Express.js
- In-Memory Data Store (Arrays mimicking databases for lighter execution)
- CORS & automated environment variables management

## 💻 Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Running Locally

1. **Start the Backend Server**
Open a terminal instance and run:
```bash
cd backend
npm install
npm run dev
```
The backend will launch at `http://localhost:5000`.

2. **Start the Frontend Client**
Open a second terminal instance and run:
```bash
cd App
npm install
npm run dev
```
The client application will kickstart at `http://localhost:5173` (or depending on Vite's available port).

## 📁 Project Structure
```text
Event Management/
├── App/                   # React Frontend Client
│   ├── src/
│   │   ├── components/    # Reusable UI pieces (GlassCards, Carousels, Navbars)
│   │   ├── pages/         # Core application views (Home, Login, Dashboard, Offers)
│   │   ├── store/         # Redux implementations (Auth, Booking slices)
│   │   ├── utils/         # System utilities (including MockAPI references)
│   │   └── data/          # Mock JSON data structures
│   ├── index.html         
│   └── vite.config.js     
│
└── backend/               # Express Backend Server
    ├── controllers/       # Route logic definitions handling specific actions
    ├── models/            # In-memory datasets managing persistence for this session
    ├── routes/            # Express endpoint mappings routing frontend calls
    ├── index.js           # Express Server core entry point
    └── package.json       # Backend dependencies
```
