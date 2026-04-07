# 🌍 Triplova — Modern Triplova Application

> *"Making Every Mile Memorable"*

Triplova is a full-stack, modern Triplova web application built with **React + Vite**, powered by a **Node.js/Express** backend. It features continent-based destination browsing, real-time API-driven packages, WhatsApp-based instant booking confirmations, and a premium mobile-first UI with dual Firebase + Phone.Email authentication.

---

## ✨ Key Features

### 🗺️ Destination Browsing
- **Continent-Based Navigation** — Dynamically loads continents (Asia, Africa, etc.) from the Triplova Continents API
- **Category Drill-Down** — Explore categories within each continent with rich cards and imagery
- **Package Discovery** — View and book specific travel packages per category
- **Trending Slider** — Curated trending destinations displayed in an interactive carousel
- **Premium Collection** — Hand-picked luxury packages (Maldives, Swiss Alps, Kyoto)

### 🔐 Dual Authentication System
- **Firebase Authentication** — Email/Password sign-up and login
- **Phone.Email Verification** — Mobile number OTP verification via the Phone.Email widget
- **Role-Based Access** — Segregated User and Admin portals with `ProtectedRoute` guards
- **Session Persistence** — Firebase `onAuthStateChanged` listener maintains auth state

### 📱 Instant WhatsApp Booking
- **One-Click Booking** — "Book Now" immediately triggers a WhatsApp message to the user's verified phone
- **No Modal Interruption** — Direct toast notification confirms the booking initiation
- **Rich Message Format** — Detailed trip info, pricing, and payment instructions sent via Twilio WhatsApp
- **Booking Intent Logging** — Every booking attempt is persisted to SQLite for admin tracking

### 💛 Wishlist System
- **Save Favorites** — Heart icon on any package card to save to wishlist
- **Persistent Storage** — Wishlist managed via React Context with localStorage backup
- **Book from Wishlist** — Full "Book Now" WhatsApp flow available directly from the Wishlist page

### 🛡️ Admin Panel
- **Package Management** — CRUD operations for Categories, SubCategories, and ChildCategories
- **User Management** — View all registered users with verification status
- **Contact Messages** — View and manage contact form submissions
- **Booking Overview** — Track all booking intents logged through the system

---

## 🏗️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI Component Library |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 3** | Utility-First Styling |
| **React Router DOM 7** | Client-Side Routing |
| **Lucide React** | Icon System |
| **Firebase SDK** | Authentication |
| **Phone.Email Widget** | Mobile Number Verification |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API Server |
| **SQLite3** | Local File-Based Database |
| **Bcrypt** | Password & OTP Hashing |
| **JSON Web Tokens** | Session Tokens |
| **Twilio** | WhatsApp Message Dispatch |
| **NodeMailer** | Email OTP Delivery |

### External APIs
| Endpoint | Description |
|---|---|
| `continents.php` | Fetch all continents with images |
| `continents.php?continent=africa` | Fetch categories within a continent |
| `continents.php?category=dubai` | Fetch packages for a specific category |
| `category.php` | CRUD for travel categories |
| `subcategory.php` | CRUD for subcategories |
| `childcategory.php` | CRUD for child categories (packages) |

---

## 📁 Project Structure

```text
trip-booking-app/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── Footer.jsx             # Site-wide footer with links
│   │   ├── LoginModal.jsx         # Reusable login modal overlay
│   │   ├── Navbar.jsx             # Global navigation bar with search
│   │   ├── PackageCard.jsx        # Package card with Book Now + Wishlist
│   │   ├── ProtectedRoute.jsx     # Role-based route guard
│   │   └── TrendingSlider.jsx     # Trending destinations carousel
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state & methods
│   │   └── WishlistContext.jsx    # Wishlist state management
│   ├── pages/
│   │   ├── About.jsx              # About Triplova page
│   │   ├── AdminLogin.jsx         # Admin-specific login
│   │   ├── AdminPanel.jsx         # Full admin dashboard (CRUD)
│   │   ├── Blog.jsx               # Blog/articles page
│   │   ├── Careers.jsx            # Careers listing page
│   │   ├── CategoryPackages.jsx   # Packages within a category (API)
│   │   ├── Contact.jsx            # Contact form page
│   │   ├── ContinentDetail.jsx    # Categories within a continent (API)
│   │   ├── Destinations.jsx       # All continents + curated collections
│   │   ├── Home.jsx               # Landing page with hero, packages, trending
│   │   ├── Login.jsx              # Firebase user/admin login
│   │   ├── PlaceholderPage.jsx    # Generic placeholder for upcoming pages
│   │   ├── Premium.jsx            # Premium luxury packages
│   │   ├── Reviews.jsx            # Customer reviews/testimonials
│   │   ├── Signup.jsx             # User registration + phone verification
│   │   ├── UserDashboard.jsx      # Authenticated user dashboard
│   │   └── Wishlist.jsx           # Saved packages with booking
│   ├── services/
│   │   └── api.js                 # All API endpoint definitions
│   ├── App.jsx                    # Router & Provider setup
│   ├── firebase.js                # Firebase SDK initialization
│   ├── index.css                  # Global styles & Tailwind directives
│   └── main.jsx                   # React DOM entry point
├── server/
│   ├── db.js                      # SQLite schema & table initialization
│   ├── server.js                  # Express API server (500+ lines)
│   ├── database.sqlite            # SQLite database file
│   ├── migrate.cjs                # Database migration helper
│   └── package.json               # Backend dependencies
├── .env                           # Environment variables (not committed)
├── package.json                   # Frontend dependencies & scripts
├── tailwind.config.js             # Tailwind CSS configuration
├── vite.config.js                 # Vite bundler + proxy configuration
└── README.md                      # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18.x or above
- **Firebase** project with Email/Password auth enabled
- **Phone.Email** developer account for mobile verification
- **Twilio** account (optional, for real WhatsApp messages)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd trip-booking-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Phone.Email Verification
VITE_PHONE_EMAIL_CLIENT_ID=your_phone_email_client_id

# Twilio WhatsApp (Optional — falls back to console logging in dev mode)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 3. Run the Application

Both the frontend and backend must run concurrently:

```bash
# Terminal 1 — Start the Backend (Express + SQLite)
npm run backend
# → Server runs at http://localhost:5001

# Terminal 2 — Start the Frontend (Vite)
npm run dev
# → App runs at http://localhost:3333

# OR run everything at once:
npm run dev:all
```

---

## 🗺️ Route Map

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, packages, trending slider |
| `/destinations` | Destinations | All continents from API + curated collections |
| `/destinations/:continent` | ContinentDetail | Categories within a specific continent |
| `/destinations/:continent/:category` | CategoryPackages | Packages within a category with booking |
| `/premium` | Premium | Luxury package collection |
| `/reviews` | Reviews | Customer testimonials |
| `/about` | About | About Triplova |
| `/contact` | Contact | Contact form |
| `/blog` | Blog | Articles and travel tips |
| `/careers` | Careers | Job listings |
| `/wishlist` | Wishlist | Saved packages (requires auth) |
| `/login` | Login | Firebase user/admin login |
| `/signup` | Signup | Registration + phone verification |
| `/user-dashboard` | UserDashboard | Protected user portal |
| `/admin-panel` | AdminPanel | Protected admin CRUD portal |

---

## 🔌 API Reference

### External Triplova APIs (via Vite proxy → `triplova.com`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/continents.php` | List all continents |
| `GET` | `/admin/continents.php?continent={name}` | Categories by continent |
| `GET` | `/admin/continents.php?category={name}` | Packages by category |
| `GET` | `/admin/category.php` | List all categories |
| `POST` | `/admin/category.php` | Create category (FormData) |
| `GET` | `/admin/subcategory.php` | List all subcategories |
| `GET` | `/admin/childcategory.php` | List all child categories |

### Local Backend APIs (`http://localhost:5001`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register local user |
| `POST` | `/api/auth/sync-firebase-user` | Sync Firebase user to SQLite |
| `POST` | `/api/auth/verify-phone-email` | Verify phone via Phone.Email JSON |
| `GET` | `/api/auth/profile/:email` | Get user profile by email |
| `POST` | `/api/auth/send-email-otp` | Send email OTP |
| `POST` | `/api/auth/send-phone-otp` | Send phone OTP |
| `POST` | `/api/auth/verify-email-otp` | Verify email OTP |
| `POST` | `/api/auth/verify-phone-otp` | Verify phone OTP |
| `POST` | `/api/auth/login` | Email + password login |
| `POST` | `/api/auth/login-phone` | Phone OTP login |
| `POST` | `/api/auth/verify-login-otp` | Verify login OTP |
| `GET` | `/api/auth/users` | List all users (admin) |
| `POST` | `/api/bookings` | Log booking intent |
| `POST` | `/api/whatsapp/send` | Send WhatsApp message via Twilio |
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/contact` | List contact messages |
| `DELETE` | `/api/contact/:id` | Delete contact message |

---

## 🔒 Security

- **Password Hashing** — All passwords hashed with `bcrypt` (10-round salt) before storage
- **OTP Security** — OTPs are hashed, time-limited (5 min), and attempt-limited (3 max)
- **JWT Sessions** — Stateless authentication tokens with 24-hour expiry
- **Role-Based Guards** — `ProtectedRoute` component enforces `user` vs `admin` access
- **Firebase Auth** — Email/password managed by Firebase with `onAuthStateChanged` listener
- **Phone Verification** — Independent phone number verification via Phone.Email network
- **Twilio Fallback** — WhatsApp messages logged to console in dev mode when Twilio credentials are absent

---

## 📱 Booking Flow

```
User clicks "Book Now"
        │
        ├── Not logged in? → Redirect to /login
        ├── Phone not verified? → Show error toast
        │
        └── Authenticated + Verified Phone
                │
                ├── 1. Show success toast immediately
                ├── 2. Log booking intent to SQLite
                ├── 3. Send WhatsApp message via Twilio
                │       (or log to console in dev mode)
                └── 4. Confirm or show error toast
```

---

## 🎨 Design System

- **Colors** — Primary blue (`primary-600`), accent yellow (`#FFCE00`), dark grays for contrast
- **Typography** — System sans-serif + serif for headings
- **Animations** — Smooth scale transitions, fade-in effects, spin loaders
- **Glassmorphism** — `backdrop-blur-md` + semi-transparent backgrounds on overlays
- **Cards** — Rounded corners (`rounded-2xl`/`rounded-3xl`), hover shadows, image zoom on hover
- **Toast Notifications** — Fixed-position bottom-center with gradient backgrounds and auto-dismiss

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3333 |
| `npm run backend` | Start Express backend on port 5001 |
| `npm run db-server` | Start JSON Server on port 5000 |
| `npm run dev:all` | Run all three concurrently |
| `npm run build` | Production build via Vite |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is private and proprietary to Triplova.

---

*Built with ❤️ by the Triplova Team*
