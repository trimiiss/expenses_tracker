# ðŸ’¸ ExpenseTrack â€” MERN Stack Expense Tracker

A full-stack expense tracker built with **MongoDB, Express.js, React.js, and Node.js** featuring JWT authentication, full CRUD, and rich analytics with charts.

---

## ðŸ—‚ Project Structure

```
expenses-tracker/
â”œâ”€â”€ server/               # Node.js + Express backend
â”‚   â”œâ”€â”€ config/db.js      # MongoDB connection
â”‚   â”œâ”€â”€ controllers/      # Business logic
â”‚   â”œâ”€â”€ middleware/        # JWT auth + validation
â”‚   â”œâ”€â”€ models/           # Mongoose schemas (User, Expense)
â”‚   â”œâ”€â”€ routes/           # API route definitions
â”‚   â”œâ”€â”€ .env              # Environment variables
â”‚   â””â”€â”€ index.js          # Server entry point
â”‚
â””â”€â”€ client/               # React + Vite frontend
    â””â”€â”€ src/
        â”œâ”€â”€ api/           # Axios instance with JWT interceptors
        â”œâ”€â”€ components/    # Navbar, PrivateRoute, ExpenseModal
        â”œâ”€â”€ context/       # AuthContext (global auth state)
        â”œâ”€â”€ pages/         # Login, Register, Dashboard, Expenses, Analytics
        â””â”€â”€ utils/         # Categories, colors constants
```

---

## âš™ï¸ Prerequisites

- **Node.js** v18+
- **MongoDB** â€” running locally on `mongodb://localhost:27017` OR a [MongoDB Atlas](https://cloud.mongodb.com) URI

---

## ðŸš€ Installation & Setup

### 1. Clone & enter the project

```bash
git clone <repo-url>
cd expenses-tracker
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Edit `server/.env` with your settings:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenses-tracker
JWT_SECRET=replace_with_a_strong_secret_key
NODE_ENV=development
```

Start the server:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Server runs at: **http://localhost:5000**

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## ðŸ”Œ API Endpoints

### Auth
| Method | Endpoint              | Description       | Auth |
|--------|-----------------------|-------------------|------|
| POST   | `/api/auth/register`  | Register user     | âŒ   |
| POST   | `/api/auth/login`     | Login & get token | âŒ   |
| GET    | `/api/auth/me`        | Get current user  | âœ…   |

### Expenses
| Method | Endpoint                   | Description              | Auth |
|--------|----------------------------|--------------------------|------|
| GET    | `/api/expenses`            | Get all expenses (+ filter/sort) | âœ… |
| POST   | `/api/expenses`            | Create expense            | âœ…   |
| PUT    | `/api/expenses/:id`        | Update expense            | âœ…   |
| DELETE | `/api/expenses/:id`        | Delete expense            | âœ…   |
| GET    | `/api/expenses/analytics`  | Get analytics summary     | âœ…   |

---

## âœ¨ Features

- ðŸ” JWT authentication (register / login / protected routes)
- ðŸ”’ bcrypt password hashing
- ðŸ“‹ Full CRUD for expenses (title, amount, category, date, note)
- ðŸ” Search, filter by category, sort by date or amount
- ðŸ“Š **Dashboard** â€” summary cards + pie chart + recent expenses
- ðŸ“ˆ **Analytics** â€” pie chart, bar chart, line chart trend, top-5 categories
- ðŸŽ¨ Dark mode UI with glassmorphism and smooth animations
- ðŸ“± Fully responsive (mobile-friendly)

---

## ðŸ›  Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router, Recharts  |
| Styling    | Vanilla CSS (dark mode, responsive)     |
| HTTP       | Axios (with JWT interceptors)           |
| Backend    | Node.js, Express.js                     |
| Auth       | JWT + bcryptjs                          |
| Validation | express-validator                       |
| Database   | MongoDB + Mongoose                      |
