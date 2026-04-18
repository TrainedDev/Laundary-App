# 🧺 LaundryOS — Mini Laundry Order Management System

A full-stack order management system for laundry businesses, built with Node.js, Express, PostgreSQL (Sequelize), React (Vite), and Tailwind CSS.

---

🌐 Live Demo
Frontend: https://laundary-app-seven.vercel.app
Backend API: https://laundary-app-63ub.onrender.com

## 📁 Project Structure

```
laundry-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize + PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, GetMe
│   │   ├── orderController.js   # CRUD for orders
│   │   └── adminController.js   # Dashboard stats
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect + role restrict
│   │   └── errorMiddleware.js   # Global error handler
│   ├── models/
│   │   ├── User.js              # User model (bcrypt hooks)
│   │   ├── Order.js             # Order model (JSONB garments)
│   │   └── index.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── appError.js          # Custom error class
│   │   └── asyncHandler.js      # Async wrapper
│   ├── app.js                   # Express app setup
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx        # Sidebar + nav shell
    │   │   └── ui.jsx            # Shared UI components
    │   ├── context/
    │   │   └── AuthContext.jsx   # JWT auth state (Context API)
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── CreateOrderPage.jsx
    │   │   └── OrderDetailPage.jsx
    │   ├── services/
    │   │   ├── api.js            # Axios instance + interceptors
    │   │   └── orderService.js   # API calls for orders
    │   ├── App.jsx               # Routes + protected route
    │   ├── main.jsx
    │   └── index.css             # Tailwind + custom layers
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL (local) **or** a Supabase project
- npm or yarn

---

### 1. Clone / extract the project

```bash
cd laundry-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000

# Local PostgreSQL
DB_URL=postgresql://postgres:yourpassword@localhost:5432/laundry_db

# OR Supabase (use the "Transaction" pooler connection string)
# DB_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Supabase note:** Use the **Session Mode** pooler URL (port 5432) from  
> Project Settings → Database → Connection Pooling.  
> Set `NODE_ENV=production` to enable SSL.

Create the local database (skip for Supabase):

```bash
psql -U postgres -c "CREATE DATABASE laundry_db;"
```

Start the backend:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

Sequelize will auto-sync tables on first run (`alter: true` in dev).

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173**

---

## 🔑 API Reference

All protected routes require:  
`Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders` | Yes | List orders (filterable) |
| GET | `/api/orders/:id` | Yes | Get order by ID |
| PATCH | `/api/orders/:id` | Yes | Update order/payment status |
| DELETE | `/api/orders/:id` | Yes | Delete order |

**GET /api/orders query params:** `customerName`, `phoneNumber`, `orderStatus`

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Yes | Stats: total orders, revenue, breakdown |

---

## ✅ Features Implemented

### Backend
- JWT authentication (register / login / protected routes)
- Passwords hashed with bcrypt (salt rounds: 12)
- Order CRUD with calculated `totalAmount`
- Garments stored as JSONB array: `[{ type, quantity, pricePerItem }]`
- Filter orders by `customerName` (iLike), `phoneNumber`, `orderStatus`
- Admin dashboard: total orders, revenue from paid orders, status breakdown
- Centralized async error handling (`asyncHandler` wrapper)
- Global error middleware with Sequelize / JWT error normalisation
- Custom `AppError` class for operational errors
- CORS configured for frontend origin
- Environment-based SSL for Supabase / production

### Frontend
- React + Vite + Tailwind CSS dark theme
- Context API auth with JWT persisted to `localStorage`
- Axios instance with request interceptor (auto-attach token) and 401 redirect
- Protected routes (redirect to `/login` if unauthenticated)
- **Dashboard:** stat cards, order + payment status progress bars
- **Orders list:** filter by name / phone / status, clickable rows
- **Create order:** dynamic garment rows, live total calculation, 17 garment types
- **Order detail:** full breakdown, inline status update, delete with confirmation
- Responsive layout: collapsible sidebar on mobile
- Loading skeletons, empty states, error / success alerts
- Smooth animations (fade-in, slide-up, slide-in-right)

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — primary code generation
- **ChatGPT** — prompt refinement and spec clarification

### Sample Prompt Used
```
Build a complete Mini Laundry Order Management System with:
- Backend: Node.js + Express + PostgreSQL (Sequelize, Supabase compatible)
- Frontend: React (Vite) + Tailwind CSS
- JWT auth, order CRUD, admin dashboard
- Production-level folder structure, error handling, async/await
- Dark theme UI, responsive, professional
```

### What AI Got Right
- Clean folder structure mirroring real-world Express projects
- Sequelize model hooks for bcrypt hashing
- Proper JWT middleware with error propagation
- Dynamic garment rows with live total in React
- Tailwind utility-first dark theme with CSS layers

### What AI Got Wrong / Needed Manual Fix
1. **Sequelize `sync` strategy** — AI initially used `force: true` (drops tables on every restart). Changed to `alter: true` for dev and no auto-sync for production.
2. **CORS origin** — AI hardcoded `*`. Fixed to read `CLIENT_URL` from env.
3. **iLike operator** — AI used `Op.like` for case-insensitive search; PostgreSQL requires `Op.iLike`.
4. **Supabase SSL** — AI missed `rejectUnauthorized: false` needed for Supabase pooler connections.
5. **React Router v6** — AI used `<Switch>` (v5 API). Updated to `<Routes>` + `<Route>` with `element` prop.
6. **Token refresh on page reload** — AI's initial `AuthContext` lost the user on hard refresh. Added `useEffect` to re-fetch `/auth/me` on mount.

---

## ⚖️ Trade-offs & Decisions

| Decision | Reason |
|----------|--------|
| No payment integration (Razorpay/Stripe) | Simplified billing using calculated totals to focus on core order management features |
| Token storage in localStorage | Chosen for simplicity over more secure options like HTTP-only cookies |
| No caching layer (Redis) | Direct DB queries were sufficient for this scale; avoided added infrastructure complexity |
| No advanced state management | Used Context API instead of Redux to keep frontend lightweight |

### Skipped (out of scope)

- Automated testing (Jest / Supertest)
- Input validation using express-validator
- API rate limiting and security hardening
- Advanced caching (Redis)

### Future Improvements

- 💳 Payment integration (Razorpay / Stripe)
- 🧪 Unit, API, and E2E testing
- ⭐ Customer feedback system
- 🎨 Improved UI/UX with better design system
- ⚡ Add caching layer (Redis) for performance optimization


## 🚀 Quick Start (TL;DR)

```bash
# Terminal 1 — Backend
cd laundry-app/backend && npm install && cp .env.example .env
# edit .env with your DB_URL and JWT_SECRET
npm run dev

# Terminal 2 — Frontend
cd laundry-app/frontend && npm install && cp .env.example .env
npm run dev

# Open http://localhost:5173
# Register an account → start creating orders
```
