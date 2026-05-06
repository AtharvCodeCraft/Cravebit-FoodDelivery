# CraveBite - Food Ordering System

CraveBite is a full-stack, scalable, and production-ready Food Ordering System built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS. It features a premium modern UI, real-time live order tracking via Socket.io, and role-based access control.

## 🚀 Features

### User Features

- **Authentication**: Secure JWT-based registration and login with bcrypt password hashing.
- **Browse & Search**: Find favorite restaurants and food items.
- **Cart & Checkout**: Seamless additive cart experience and order placement.
- **Live Order Tracking**: Dynamic, real-time status updates using WebSocket (Socket.io).
- **Order History**: View all past orders and their details.
- **Responsive UI**: Built with React, Tailwind v4, and Framer Motion for premium aesthetics.

### Admin Features

- **Dashboard**: View and manage all user orders.
- **Order Management**: Real-time order status updates (Placed → Preparing → Out for Delivery → Delivered) that push instantly to users.
- **CRUD Operations**: API support for adding/editing restaurants and food items.

## 📁 Project Structure

This repository contains two main folders:

- `/frontend` - React application built with Vite and Tailwind CSS.
- `/backend` - Node.js Express API and MongoDB models.

## 🛠️ Tech Stack

**Frontend:** React, React Router Dom, Axios, Tailwind CSS, Framer Motion, Context API
**Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JSON Web Token (JWT), Socket.io, express-validator

## ⚙️ Setup Instructions

### Prerequisites

Make sure you have Node.js (v18+) and npm installed on your machine.
You will also need a MongoDB Atlas cluster URI.

### 1. Clone & Install Dependencies

First, install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

In the `backend/` directory, create a `.env` file (an example structure is provided below) and fill in your MongoDB URI and a random string for your JWT secret.

**`backend/.env` Example**

```env
# Server
NODE_ENV=development
PORT=5000

# Database Connectivity
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cravebite?retryWrites=true&w=majority

# Authentication
JWT_SECRET=super_secret_key_change_this_in_production

# Optional 3rd Party Mock API Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Run the Application Localy

You will need to start both the backend server and the frontend development server. Open two separate terminals:

**Terminal 1 (Backend)**

```bash
cd backend
npm run dev
# The backend API and Socket.io server will be running on http://localhost:5000
```

**Terminal 2 (Frontend)**

```bash
cd frontend
npm run dev
# The Vite frontend will be running on http://localhost:5173
```

---

## 📖 API Documentation

### Authentication `/api/auth`

- `POST /register` - Register a new user
- `POST /login` - Authenticate a user and get token
- `GET /profile` - Get logged-in user profile (Private)
- `PUT /profile` - Update profile (Private)

### Restaurants `/api/restaurants`

- `GET /` - Get all restaurants (Public)
- `GET /:id` - Get single restaurant info (Public)
- `POST /` - Create new restaurant (Admin Only)
- `PUT /:id` - Update restaurant info (Admin Only)
- `DELETE /:id` - Delete a restaurant (Admin Only)

### Food Items `/api/food`

- `GET /` - Get all food items (Public)
- `GET /restaurant/:id` - Get food items strictly by restaurant ID (Public)
- `POST /` - Add a new food item (Admin Only)
- `PUT /:id` - Update food item (Admin Only)
- `DELETE /:id` - Delete food item (Admin Only)

### Orders `/api/orders`

- `POST /` - Place a new order (Private)
- `GET /myorders` - Get current user's orders (Private)
- `GET /` - Get all global orders (Admin Only)
- `PUT /:id/status` - Update an order's status and emit socket event (Admin Only)
- `GET /:id` - Get specific order by ID (Private/Admin)

### Reviews `/api/reviews`

- `POST /` - Add a rating / review (Private)
- `GET /restaurant/:id` - Get all reviews for a specific restaurant (Public)

---

## 📡 Socket.io Events Setup

The app uses `socket.io` to provide real-time updates.

1. The client joins a room using the `orderId` via the `join_order_room` event.
2. The Admin makes a `PUT /api/orders/:id/status` request.
3. The server updates the database and emits an `order_status_update` event specifically to the `orderId` room.
4. The client's React State updates automatically without refreshing the page!

Enjoy CraveBite!
