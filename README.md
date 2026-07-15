# 📁 Project Structure Guide

This document explains the folder structure for both Backend and Frontend.

---

# 🔥 Backend Structure

```
backend/
│
├── config/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── utils/
├── uploads/
├── app.js
├── server.js
└── .env
```

---

## 📂 config/

Contains project configuration files.

Examples:

- Database Connection
- Environment Configuration

Example:

```
db.js
```

---

## 📂 controllers/

Receives requests from routes.

Responsibilities:

- Receive Request
- Validate basic input
- Call Service
- Return Response

Controllers should NOT contain business logic.

Example:

```
asset.controller.js
booking.controller.js
```

---

## 📂 services/

Contains all Business Logic.

Responsibilities:

- Process data
- Execute business rules
- Communicate with database
- Return result to controller

Example:

```
booking.service.js
payment.service.js
```

---

## 📂 models/

Contains all MongoDB Models (Mongoose Schemas).

Example:

```
User.js
Company.js
Asset.js
Booking.js
Contract.js
```

---

## 📂 routes/

Contains API Endpoints.

Responsibilities:

- Define URLs
- Connect Routes with Controllers

Example:

```
auth.routes.js
asset.routes.js
booking.routes.js
```

---

## 📂 middlewares/

Contains reusable middleware.

Examples:

- Authentication
- Authorization
- Error Handling
- File Upload
- Validation

---

## 📂 utils/

Contains helper functions.

Examples:

- Generate JWT
- Format Response
- Date Helpers
- Common Functions

---

## 📂 uploads/

Stores uploaded files.

Examples:

- Asset Images
- Company Documents
- Inspection Images

---

## app.js

Application Configuration

Contains:

- Middlewares
- Routes
- Error Handler

---

## server.js

Starts Express Server and connects Database.

---

# 🎨 Frontend Structure

```
frontend/
│
├── src/
│
├── app/
│   ├── core/
│   ├── shared/
│   ├── layouts/
│   ├── pages/
│   ├── app.routes.ts
│   └── app.config.ts
│
├── assets/
├── environments/
└── styles.css
```

---

## 📂 core/

Contains application core services.

Examples:

- Auth Service
- API Service
- Guards
- Interceptors

These files are used across the whole application.

---

## 📂 shared/

Contains reusable components.

Examples:

- Navbar
- Sidebar
- Table
- Modal
- Loader
- Search Bar
- Pagination
- Buttons

Anything reused more than once goes here.

---

## 📂 layouts/

Contains page layouts.

Examples:

### Auth Layout

```
Login
Register
```

### Dashboard Layout

```
Sidebar
Navbar
Content
Footer
```

---

## 📂 pages/

Contains application pages.

Each feature has its own folder.

Example:

```
auth/

dashboard/

assets/

bookings/

contracts/

payments/

maintenance/

profile/
```

---

## 📂 assets/

Contains static files.

Examples:

- Images
- Icons
- Fonts
- Global CSS

---

## 📂 environments/

Contains environment variables.

Examples:

```
environment.ts

environment.development.ts
```

---

## styles.css

Global styles shared across the project.

---

# 💡 Development Rules

## Backend

Flow:

```
Route
   ↓
Controller
   ↓
Service
   ↓
Model
```

---

Business Logic must be inside Services.

Controllers should stay clean.

---

## Frontend

Pages contain page-specific UI.

Shared contains reusable components.

Core contains global services and application logic.

---

# 📌 Naming Convention

Controllers

```
asset.controller.js
```

Services

```
asset.service.js
```

Models

```
Asset.js
```

Routes

```
asset.routes.js
```

Angular Components

```
asset-list.component.ts

asset-details.component.ts
```

Services

```
asset.service.ts
```

---

# 🚀 Goal

Keep the project:

- Organized
- Scalable
- Easy to understand
- Easy for all team members to contribute