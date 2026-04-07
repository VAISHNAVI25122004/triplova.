# Triplova Project - Full Documentation

## 1. Project Overview
Triplova is a modern, full-stack travel booking application built for performance, seamless user experience, and robust admin capabilities. It offers destination discovery, booking capabilities featuring WhatsApp integrations, and role-based access control.

### Value Proposition
- Extensible, multi-continent travel destinations.
- Secure, token-based and OTP authentication.
- Seamless "one-call-to-action" direct-to-WhatsApp booking approach.

---

## 2. Architecture & Tech Stack

### 2.1 Frontend
- **Framework:** React 19 mapped via Vite 7 for rapid development builds.
- **Styling:** Tailwind CSS 3 (utility-first, responsive, and customizable).
- **Icons:** Lucide React for consistent SVG iconography.
- **Routing:** React Router v7 configured for client-side navigation.
- **State Management:** React Context API (`AuthContext` and `WishlistContext`).

### 2.2 Backend
- **Server:** Node.js with Express JS.
- **Database:** SQLite3 for lightweight, local file-based persistent data storage.
- **Authentication Services:** Firebase Admin (syncing), Phone.Email, JSON Web Tokens (JWT), Bcrypt for hashing.
- **Notification Services:** Twilio API for WhatsApp automated booking confirmations.

### 2.3 Architecture Pattern
The project strictly separates the presentation layer from the business logic:
- `src/pages/`: Container components mapping to distinct routes.
- `src/components/`: Reusable, modular UI elements (`Navbar`, `Footer`, `PackageCard`).
- `src/context/`: Global application state accessible without deep prop drilling.
- `src/services/`: Abstracted external API request layers (`api.js`).
- `server/`: Dedicated RESTful API handling server logic, database interactions, and backend security.

---

## 3. Directory Structure

```text
trip-booking-app/
├── public/                 # Favicon, robots.txt, static uncompiled assets
├── src/
│   ├── assets/             # Project-specific images and graphics
│   ├── components/         # Reusable UI Blocks (Nav, Footer, Cards)
│   ├── context/            # React Context providers (Auth, Wishlist)
│   ├── pages/              # Application Routes (Home, AdminPanel, Login, etc.)
│   ├── services/           # Network request configurations (API wrapper)
│   ├── App.jsx             # React Router mapping
│   ├── firebase.js         # Firebase client configuration
│   ├── index.css           # Global CSS variables and Tailwind directives
│   └── main.jsx            # Application DOM Root
├── server/
│   ├── database.sqlite     # Persistent local SQLite Storage
│   ├── db.js               # Database schema maps and queries
│   ├── server.js           # Express instance, route definitions
│   └── package.json        # Backend decoupled dependency listing
├── .env.example            # Environment variables template
├── package.json            # Central Node.js project manifest
├── tailwind.config.js      # Styling configuration and overrides
└── vite.config.js          # Vite build instructions
```

---

## 4. Key Application Features

### 4.1 Security and Authentication
The platform provides dual-auth workflows to ensure high flexibility:
- **Firebase Auth:** Handles core Email/Password validations.
- **Phone.Email Auth:** Verifies users using mobile number verification directly inside the app.
- **Role-Based Guards:** Private routes are wrapped in a generic `<ProtectedRoute />` that parses user claims to render admin or standard user interfaces safely.

### 4.2 Triplova API Integation
- Dynamic API calls to `triplova.com` services for structured content (Continents -> Categories -> Packages).
- Frontend queries abstracted inside the `services/api.js` to simplify asynchronous fetching in `useEffect` hooks across pages.

### 4.3 Interactive "Book Now" Module
- Clicking "Book Now" verifies the active user session.
- Once verified, the operation creates an intent inside the internal SQLite DB and immediately triggers a Twilio WhatsApp message sequence.

---

## 5. Development Workflow & Commands

| Command | Usage | Description |
|-----------|---------|---------------|
| `npm run dev` | Frontend Only | Starts the Vite hot-reloading development server |
| `npm run backend` | Backend Only | Starts the Express/SQLite server at port `5001` |
| `npm run db-server`| Mocks/JSON | Starts a dummy `json-server` for localized rapid UI prototyping |
| `npm run dev:all` | Fullstack | Concurrently runs Frontend, Backend, and Mock server |
| `npm run lint` | Validation | Validates codebase against ESLint rules |
| `npm run build` | Deployment | Bundles Vite optimized static assets for production deployment |

---

## 6. Deployment Considerations
- **Environment Targeting:** Ensure `.env` files are injected correctly across the respective hosting environments.
- **Database Scaling:** If user load expands, consider migrating from `sqlite3` to PostgreSQL or MySQL via an ORM like Sequelize or Prisma for improved concurrent write scaling.
