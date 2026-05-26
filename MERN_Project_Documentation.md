# MERN Stack Project Documentation

## Project Name
**DEVIT EVENT - Event Management System**

## Developed By
**Meet Patel**

## Technology Stack
- **M**ongoDB (Database)
- **E**xpress.js (Backend API Framework)
- **R**eact (Frontend UI Library)
- **N**ode.js (Runtime Environment)

## Project Version
**Version 1.0**

## Date
**May 26, 2026**

---

### [📸 Add Screenshot Here: Project Logo / Brand Icon & Splash Screen]

---

## 1. Project Overview

**DEVIT EVENT** is a complete full-stack Event Management & Reservation Platform built using the **MERN Stack**. 

The platform connects event organizers and attendees seamlessly:
- **Organizers** can create events, manage digital ticket tiers (Base, VIP, VVIP), analyze ticket sales trends, and monitor attendee directories in real-time.
- **Attendees** can browse upcoming concerts, festivals, and activities, filter by category or dynamic cities, purchase tickets in multiple tiers, and receive fully automated confirmation emails embedded with unique dynamic digital QR passes.

The system features robust backend validation, MongoDB storage security, secure JWT authentication, and high-fidelity responsive CSS dashboards.

---

### [📸 Add Screenshot Here: Landing Page / Client Home Page]

---

## 2. Main Features

### 👥 User / Attendee Features
- **User Registration & Login:** Safe authentication using BCrypt hashing and JSON Web Tokens.
- **Dynamic City & Category Filter:** Real-time event grouping and location filters.
- **Interactive Event Details:** View schedule, maps link, visual descriptions, and available tickets.
- **Flexible Ticket Tiers:** Select Normal, VIP, or VVIP options with auto-calculated rates and group discounts.
- **Instant E-Ticket Delivery:** Fully authenticated Gmail SMTP digital QR entrance passes sent instantly to the user's inbox upon purchase.
- **My Bookings History:** Interactive past and active reservation grids.

### 💼 Organizer Features
- **Interactive Analytics Dashboard:** Clickable high-fidelity stat cards that reveal popup modals for:
  - *Best Performing Event Details:* Tracks total revenue, ticket sales, remaining capacity, and descriptions.
  - *Category Division Charts:* Displays visual event division counts and details.
  - *Average Ticket Price Calculations:* Walks through mathematical sum computations across all active listings.
- **Event Creator & Editor Form:** Supports custom prices, image URL links or local uploads, dates, time, and custom bulk discount offers.
- **Attendee Directory Directory:** Aggregates a spreadsheet grid of all registered bookers, quantities, transaction prices, and ticket tiers.

### 🛡️ Admin Features
- **Admin Dashboard Statistics:** Displays broad system-wide metrics.
- **Manage Users & Listings:** Full moderation capabilities to review, approve, or delete events.
- **Safe Reset Utility:** Complete reset controls to clear booking registers and safely restore initial seat pools.

---

### [📸 Add Screenshots Here: Login Page, Organizer Dashboard, Admin Page, Booking Screen]

---

## 3. Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | High-performance SPA with client-side routing. |
| **State Management** | Redux Toolkit | Centralized slice state for authorization and bookings. |
| **Backend** | Node.js | Fast, scalable JavaScript server environment. |
| **API Framework** | Express.js | RESTful routing structure and controller dispatching. |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL document database. |
| **Authentication** | JSON Web Tokens (JWT) | Secure stateless session keys saved in session storage. |
| **Encryption** | BCryptJS | Strong salting and hashing algorithm for passwords. |
| **Email Delivery** | Nodemailer | Gmail SMTP secure transporter optimized with Google App credentials. |
| **QR Code Engine** | QRServer API | Generates dynamic entrance pass QR tags using unique Booking IDs. |
| **Styling** | Vanilla CSS | Bespoke custom dashboard grids, gradients, and micro-animations. |
| **Version Control** | Git / GitHub | Distributed branch control and pages releases. |

---

## 4. Project Architecture

```
                    ┌─────────────────────────┐
                    │     Frontend UI         │
                    │      React.js           │
                    └──────────┬──────────────┘
                               │ HTTP Requests / JSON Responses
                               ▼
                    ┌─────────────────────────┐
                    │     REST API Router     │
                    │   Node.js + Express.js  │
                    └──────────┬──────────────┘
                               │ Mongoose ODM / Database Queries
                               ▼
                    ┌─────────────────────────┐
                    │      Database           │
                    │      MongoDB            │
                    └─────────────────────────┘
```

### Architectural Explanation:
1. **React.js Client:** Renders fully responsive layout structures. Listens to events, collects user forms, manages state pools via Redux, and communicates asynchronously with the server using Axios.
2. **Express & Node Backend:** Directs requests through authentication middlewares, passes payload validations, and executes transactional controller scripts.
3. **MongoDB Cloud Database:** Persists model schemas for User, Event, and Booking records.
4. **Nodemailer SMTP Transporter:** Runs in the background to securely dispatch automated confirmation notifications upon successful bookings.

---

### [📸 Add Screenshot Here: Architecture Diagram]

---

## 5. Database Schema

### 👤 Users Collection
Stores credential, role, and meta data.
- `_id` (Mongoose ObjectId)
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String, Required, Hash)
- `role` (String, Enum: `['user', 'organizer', 'admin']`, Default: `'user'`)
- `createdAt` (Date)

### 📅 Events Collection
Stores event details, capacities, categories, and custom ticket pricing.
- `_id` (Mongoose ObjectId)
- `title` (String, Required)
- `description` (String, Required)
- `price` (Number, Required)
- `vipPrice` (Number)
- `vvipPrice` (Number)
- `category` (String, Required)
- `location` (String, Required)
- `date` (Date, Required)
- `time` (String, Required)
- `availableSeats` (Number, Required)
- `createdAt` (Date)

### 🎟️ Bookings Collection
Tracks attendee reservations, tier choices, and paid sums.
- `_id` (Mongoose ObjectId)
- `user` (ObjectId ref User, Required)
- `event` (ObjectId ref Event, Required)
- `quantity` (Number, Required)
- `totalPrice` (Number, Required)
- `ticketType` (String, Enum: `['Normal', 'VIP', 'VVIP']`, Default: `'Normal'`)
- `createdAt` (Date)

---

### [📸 Add Screenshot Here: MongoDB Atlas Collection Structures]

---

## 6. API Endpoints

### 🛡️ Authentication Endpoints
- `POST /api/v1/auth/register` - Registers a new user account.
- `POST /api/v1/auth/login` - Authenticates credentials and returns a JWT token.

### 📅 Event Management Endpoints
- `GET /api/v1/events` - Retrieves all approved events.
- `GET /api/v1/events/my-events` - *[Organizer]* Retrieves events created by the logged-in organizer.
- `GET /api/v1/events/:id` - Retrieves a single event's details.
- `POST /api/v1/events` - *[Organizer]* Creates a new event.
- `PUT /api/v1/events/:id` - *[Organizer/Admin]* Modifies event parameters.
- `DELETE /api/v1/events/:id` - *[Organizer/Admin]* Deletes an event.

### 🎟️ Booking & Reservation Endpoints
- `POST /api/v1/bookings` - *[User]* Creates a new ticket booking.
- `GET /api/v1/bookings/my-bookings` - *[User]* Retrieves booking history for the logged-in user.
- `GET /api/v1/bookings/organizer-bookings` - *[Organizer]* Retrieves all booking entries registered to their events.
- `DELETE /api/v1/bookings/reset` - *[Admin]* Deletes all bookings and restores capacities.

---

## 7. Authentication Flow

```
   ┌──────┐          1. Sends Credentials         ┌────────┐
   │ User │ ────────────────────────────────────> │ Server │
   └──────┘                                       └────┬───┘
      ▲                                                │ 2. Validates & Creates
      │              3. Returns JWT Token              │    Signed Token
      └────────────────────────────────────────────────┴───┘
```

### Detailed Flow:
1. **Login Request:** Attendee or organizer submits credentials via the secure login form.
2. **Server Verification:** Backend controller verifies email existence, compares hashes via BCrypt, and signs a JWT key embedded with `userId` and `role`.
3. **Token Storage:** Frontend receives the token and stores it securely in `sessionStorage`, integrating it into Redux global state.
4. **Header Interceptor:** All subsequent Axios calls are intercepted and appended with the token header:
   `Authorization: Bearer <TOKEN>`
5. **Protected Access:** Routes like `/organizer`, `/admin`, and `/booking` are protected by authorization middlewares checking credentials and roles before allowing data operations.

---

### [📸 Add Screenshot Here: JWT Token Storage in Browser Application Tab]

---

## 8. Folder Structure

```
event-management/
 ┣ App/ (Frontend Client)
 ┃ ┣ public/
 ┃ ┗ src/
 ┃   ┣ components/
 ┃   ┃ ┣ Navbar/ (Search, Navigation, Menus)
 ┃   ┃ ┣ Organizer/ (Badges, Analytics Modals, Charts)
 ┃   ┃ ┣ Event/ (Create Forms, Sliders)
 ┃   ┃ ┗ Admin/ (Admin Controls, Badges)
 ┃   ┣ pages/ (Home, Organizer, Admin, BookingPage, etc.)
 ┃   ┣ routes/ (AppRoutes.jsx)
 ┃   ┣ store/ (Redux slices & configureStore)
 ┃   ┗ utils/ (api.js configuration)
 ┃
 ┣ backend/ (REST API Server)
 ┃ ┣ config/ (Database & configurations)
 ┃ ┣ controllers/ (Route handlers & business logic)
 ┃ ┣ middleware/ (Authentication & validation)
 ┃ ┣ models/ (Mongoose Database schemas)
 ┃ ┣ routes/ (REST API routing files)
 ┃ ┗ services/ (Nodemailer, event & booking DB interfaces)
 ┃
 ┣ package.json
 ┗ README.md
```

---

### [📸 Add Screenshot Here: VS Code Directory View]

---

## 9. Challenges Faced & Solutions

### 🛡️ Challenge 1: E-Ticket Delivery Blocking due to DMARC policies
* **Problem:** Using a custom gmail address through third-party services like Brevo triggered DMARC and SPF SPF blocks on Google, so confirmation emails were completely dropped before arriving in user inboxes.
* **Solution:** Re-structured the backend attempt priority in `emailService.js` to prioritize authentic **Gmail SMTP** on localhost. By authenticating directly using Nodemailer with Google App credentials, DMARC validation passed perfectly.

### 🗺️ Challenge 2: Windows deep path limits (MAX_PATH) during GitHub deployment
* **Problem:** Deploying to GitHub Pages using the `gh-pages` library failed repeatedly because cache directory folder lengths exceeded the default Windows 260-character limit.
* **Solution:** Bypassed the cache-generating libraries entirely by configuring `core.longpaths true` globally and implementing a direct shell script that builds the client, initializes a Git repository inside `App/dist`, and directly force-pushes production assets to the remote `gh-pages` branch.

### 📂 Challenge 3: Inflexible static filter dropdowns
* **Problem:** The home page city filter select dropdown was hardcoded, meaning if an organizer created a new listing in a different city, users could not select it.
* **Solution:** Re-designed `NavSearch.jsx` to dynamically fetch all active events, cleanly parse location strings via `extractCity()`, merge them with defaults, and automatically append newly registered cities.

---

## 10. Future Improvements
- **Payment Gateway:** Integration of a payment test gateway (e.g. Razorpay / Stripe).
- **Interactive Seat Maps:** Visual seat selector mapping Normal, VIP, and VVIP ticket zones.
- **SMS Ticket Dispatch:** Automated ticket delivery through Twilio SMS services.
- **Location Auto-Suggest:** Autocomplete address inputs powered by Google Maps API.

---

## 11. Final Output

**DEVIT EVENT** has been successfully developed and released as an integrated full-stack MERN platform.

The system features robust backend validation, database security, secure JWT authentication, and responsive CSS dashboards, proving a highly practical foundation for full-stack developers.

---

### 🔗 Project Repositories
- **GitHub Repository:** [https://github.com/meetpatel7247/event-management](https://github.com/meetpatel7247/event-management)
- **Live Demo Link:** [https://meetpatel7247.github.io/event-management](https://meetpatel7247.github.io/event-management)

---

### [📸 Add Final Output Screenshot Here: Fully Operational Home Page / Dashboard]
