## ExpenseTrack — MERN Stack Expense Tracker

Lightweight full-stack expense tracker built with MongoDB, Express, React, and Node.
Includes JWT authentication, expense CRUD, and simple analytics.


## Project layout

Top-level folders:

- `server/` — Node.js + Express backend (API, controllers, models)
- `client/` — React (Vite) frontend

See the repository tree for full structure.

--

## Prerequisites

- Node.js 18 or newer
- npm (comes with Node.js)
- MongoDB running locally or a MongoDB Atlas URI

--

## Quickstart

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd expenses_tracker

# backend
cd server
npm install

# frontend (in a new terminal)
cd ../client
npm install
```

2. Create a `.env` file for the server (copy `.env.example` if present) and set values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenses-tracker
JWT_SECRET=your_secret_here
NODE_ENV=development
```

3. Run the backend and frontend during development:

```bash
# in server/
npm run dev

# in client/
npm run dev
```

Default local URLs:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

--

## API (overview)

Auth endpoints:

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT
- `GET  /api/auth/me` — get current user (requires auth)

Expense endpoints (all require auth):

- `GET    /api/expenses` — list expenses (supports filters)
- `POST   /api/expenses` — create an expense
- `PUT    /api/expenses/:id` — update an expense
- `DELETE /api/expenses/:id` — delete an expense
- `GET    /api/expenses/analytics` — analytics summary





## Tech stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
