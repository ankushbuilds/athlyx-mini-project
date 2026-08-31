# ATHLYX - Complete Project Documentation

**Last Updated:** 2026-08-29  
**Project Version:** 1.0.0  
**Status:** Active Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Database Documentation](#4-database-documentation)
5. [Backend Architecture](#5-backend-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Authentication System](#7-authentication-system)
8. [API Documentation](#8-api-documentation)
9. [Features Documentation](#9-features-documentation)
10. [User Roles](#10-user-roles)
11. [File-by-File Documentation](#11-file-by-file-documentation)
12. [Data Flow Diagrams](#12-data-flow-diagrams)
13. [Routing Map](#13-routing-map)
14. [Components Documentation](#14-components-documentation)
15. [Configuration & Environment](#15-configuration--environment)
16. [Security Analysis](#16-security-analysis)
17. [Implementation Status](#17-implementation-status)
18. [Potential Cleanup & Improvements](#18-potential-cleanup--improvements)
19. [Developer Guide](#19-developer-guide)

---

## 1. Project Overview

### What is Athlyx?

Athlyx is a modern MERN-stack web application designed to connect **athletes** and **coaches** in a secure, scalable ecosystem. It enables athletes to showcase their skills, build profiles, discover coaches specializing in their sports, and maintain professional connections. Coaches can discover talented athletes, send connection requests, manage their athlete network, and maintain direct communication.

### Simple Explanation

Think of Athlyx as a **professional networking platform specifically for sports**. Athletes create profiles showcasing their achievements, sports specializations, and skills. Coaches search for athletes in their sport and send connection requests. Once connected, they can communicate via messaging, discuss opportunities, and build professional relationships.

### Purpose

- **Athlete Growth**: Athletes can build professional profiles, discover coaches, track their progress, and receive coaching guidance
- **Coach Network Building**: Coaches can efficiently find and manage talented athletes in their sport
- **Secure Communication**: Private messaging system between connected coaches and athletes
- **Showcase System**: Athletes can post media (images/videos) showcasing their performances
- **Professional Network**: Connection system with request/acceptance workflow

### Target Users

1. **Athletes** - Sports players seeking coaching and professional development
2. **Coaches** - Sports professionals offering coaching services and talent discovery
3. **Scouts** (Planned) - Talent scouts searching for promising athletes
4. **Academies** (Planned) - Sports academies recruiting talent
5. **Admins** (Planned) - Platform administrators

### Main Problem It Solves

Currently, connecting athletes with coaches is fragmented and inefficient:
- ❌ Athletes struggle to find qualified coaches in their sport
- ❌ Coaches manually search for talented athletes
- ❌ No structured system for building professional sports networks
- ❌ Communication happens through unorganized channels

Athlyx solves this by providing a **dedicated platform** where both sides can:
- Find and connect efficiently
- Communicate securely
- Build professional profiles
- Showcase achievements
- Manage relationships

---

## 2. Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.8 | UI library and component framework |
| **React Router DOM** | 7.18.2 | Client-side routing and navigation |
| **React Icons** | 5.7.0 | Icon library for UI components |
| **Axios** | 1.19.0 | HTTP client for API communication |
| **Vite** | 8.2.0 | Build tool and development server |
| **React PDF Renderer** | 4.8.1 | PDF generation capability (unused currently) |
| **OGL** | 1.0.11 | WebGL/3D graphics library (unused currently) |

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express.js** | 5.2.1 | REST API framework |
| **Node.js** | Latest | Runtime environment |
| **MongoDB** | Via Mongoose | NoSQL database |
| **Mongoose** | 9.9.1 | MongoDB ODM and schema validation |
| **JWT** | 9.0.3 | Authentication & token management |
| **bcrypt** | 6.0.0 | Password hashing & verification |
| **Multer** | 2.2.0 | File upload middleware |
| **ImageKit** | 6.0.0 | Image/video storage and optimization |
| **Cloudinary** | 1.41.3 | Cloud storage (configured, unused) |
| **CORS** | 2.8.6 | Cross-origin resource sharing |
| **Helmet** | 8.1.0 | Security headers middleware |
| **dotenv** | 17.4.2 | Environment variable management |
| **Nodemailer** | 9.0.5 | Email sending (configured, unused) |
| **Resend** | 6.24.0 | Email service (configured, unused) |

### Database

- **MongoDB** - NoSQL document database
- **Mongoose** - Schema validation and ODM

### Development Tools

- **Nodemon** - Auto-reload server during development
- **ESLint** - Code quality and style checking
- **Concurrently** - Run frontend and backend simultaneously

### File Upload & Storage

- **Primary**: ImageKit (for profile pictures and showcase media)
- **Secondary**: Cloudinary (configured but not actively used)
- **Middleware**: Multer with memory storage (temporary in-memory storage during upload)

---

## 3. Complete Folder Structure

```
Athlyx/
│
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Public header navigation
│   │   │   ├── AthleteSidebar.jsx    # Athlete-specific sidebar navigation
│   │   │   ├── CoachSidebar.jsx      # Coach-specific sidebar navigation
│   │   │   ├── Messages.jsx          # Messaging component
│   │   │   ├── Messages.css          # Messaging styles
│   │   │   ├── SpecularButton.jsx    # Reusable button component
│   │   │   ├── AthleteResume.jsx     # Athlete profile display
│   │   │   └── AthleteResume.jsx     # (Duplicate or variant)
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Landing/welcome page
│   │   │   ├── Home.jsx              # Home page (public)
│   │   │   ├── Auth.jsx              # Login/Register page
│   │   │   ├── About.jsx             # About page
│   │   │   ├── Contact.jsx           # Contact page
│   │   │   ├── Help.jsx              # Help/FAQ page
│   │   │   ├── Discover.jsx          # Public discovery (role-agnostic)
│   │   │   │
│   │   │   ├── Athlete-Pages/        # Athlete-specific pages
│   │   │   │   ├── AthleteDashboard.jsx        # Athlete dashboard
│   │   │   │   ├── AthleteProfile.jsx          # Athlete edit profile
│   │   │   │   ├── AthleteProfileView.jsx      # Athlete profile view
│   │   │   │   ├── AthleteConnections.jsx      # Athlete's coach connections
│   │   │   │   ├── Discover.jsx                # Coach discovery for athletes
│   │   │   │   ├── Opportunities.jsx           # Opportunities page (placeholder)
│   │   │   │   ├── Showcase.jsx                # Athlete media showcase
│   │   │   │   └── Settings.jsx                # Athlete settings
│   │   │   │
│   │   │   └── Coach-Pages/         # Coach-specific pages
│   │   │       ├── CoachDashboard.jsx           # Coach dashboard
│   │   │       ├── CoachProfile.jsx             # Coach edit profile
│   │   │       ├── CoachProfileView.jsx         # Coach profile view
│   │   │       ├── CoachAthletes.jsx            # Coach's connected athletes
│   │   │       ├── CoachDiscover.jsx            # Athlete discovery for coaches
│   │   │       ├── CoachRequests.jsx            # Coach's connection requests
│   │   │       └── CoachSettings.jsx            # Coach settings
│   │   │
│   │   ├── services/
│   │   │   └── auth.service.js       # Authentication API calls
│   │   │
│   │   ├── App.jsx                   # Main app component & routing
│   │   ├── App.css                   # App styles
│   │   ├── index.css                 # Global styles
│   │   ├── main.jsx                  # React entry point
│   │   │
│   │   ├── public/                   # Static assets
│   │   └── index.html                # HTML template
│   │
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── README.md
│   └── ...
│
├── backend/                          # Express.js backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection configuration
│   │   │   └── imageKit.js          # ImageKit initialization
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js            # JWT verification
│   │   │   ├── upload.middleware.js          # Profile picture upload (multer)
│   │   │   └── showcaseUpload.middleware.js  # Showcase media upload (multer)
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js           # User schema (base for all roles)
│   │   │   ├── athlete.model.js         # Athlete profile extension
│   │   │   ├── coach.model.js           # (Not separate model - coach uses user)
│   │   │   ├── connection.model.js      # Coach-Athlete connections
│   │   │   ├── coachAthlete.model.js    # Coach-Athlete relationships
│   │   │   ├── showcase.model.js        # Athlete posts/media showcase
│   │   │   ├── conversation.model.js    # Chat conversations
│   │   │   ├── message.model.js         # Chat messages
│   │   │   └── sport.model.js           # Sports reference data
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Auth logic (register, login, settings)
│   │   │   ├── athlete.controller.js     # Athlete profile management
│   │   │   ├── coach.controller.js       # Coach profile management
│   │   │   ├── user.controller.js        # User utilities (profile pic, coaches)
│   │   │   ├── connection.controller.js  # Connection request management
│   │   │   ├── coachAthlete.controller.js # Coach-Athlete relationships
│   │   │   ├── showcase.controller.js    # Showcase posts management
│   │   │   └── chat.controller.js        # Messaging system
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.route.js            # /api/auth routes
│   │   │   ├── athlete.route.js         # /api/athletes routes
│   │   │   ├── coach.route.js           # /api/coaches routes
│   │   │   ├── user.route.js            # /api/users routes
│   │   │   ├── connection.route.js      # /api/connections routes
│   │   │   ├── coachAthlete.route.js    # /api/coach-athletes routes
│   │   │   ├── showcase.route.js        # /api/showcase routes
│   │   │   └── chat.route.js            # /api/chat routes
│   │   │
│   │   └── app.js                   # Express app setup and middleware
│   │
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── package.json                     # Root workspace config
├── package-lock.json
│
└── .git/                            # Git repository
```

### Folder Purpose Summary

| Folder | Purpose |
|--------|---------|
| `frontend/src/components/` | Reusable UI components (Navbar, Sidebars, Messages, Buttons) |
| `frontend/src/pages/` | Page components organized by role (Public, Athlete, Coach) |
| `frontend/src/services/` | API communication layer |
| `backend/src/config/` | Database and external service configuration |
| `backend/src/middleware/` | Express middleware (auth, file upload) |
| `backend/src/models/` | Mongoose schemas for all data entities |
| `backend/src/controllers/` | Business logic for each API feature |
| `backend/src/routes/` | Express route definitions |

---

## 4. Database Documentation

### 4.1 User Model

**File:** `backend/src/models/user.model.js`  
**Collection Name:** `users`

The `User` model is the **base entity** for all roles. It stores authentication data and shared profile information.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | ✅ | - | User full name |
| `email` | String | ✅ | - | Email (unique, lowercase) |
| `password` | String | ✅ | - | Hashed password (bcrypt) |
| `role` | Enum | ✅ | - | User role: `athlete`, `coach`, `scout`, `academy`, `admin` |
| `profilePic` | String | ❌ | "" | ImageKit URL for profile picture |
| **Coach-specific Fields** | | | | |
| `phone` | String | ❌ | "" | Contact number |
| `address.city` | String | ❌ | "" | City |
| `address.state` | String | ❌ | "" | State |
| `address.country` | String | ❌ | "India" | Country |
| `sport` | String | ❌ | "" | Sport specialization |
| `specialization` | String | ❌ | "" | Coach's specialization |
| `experience` | Number | ❌ | 0 | Years of experience |
| `organization` | String | ❌ | "" | Organization/club name |
| `achievements` | String[] | ❌ | [] | List of achievements |
| `skills` | String[] | ❌ | [] | List of skills |
| `bio` | String | ❌ | "" | Biography/description |
| `isAvailable` | Boolean | ❌ | true | Availability status |
| **Email Verification** | | | | |
| `emailVerified` | Boolean | ❌ | false | Email verification status |
| `emailVerificationOTP` | String | ❌ | "" | OTP for email verification |
| `emailVerificationOTPExpires` | Date | ❌ | null | OTP expiration timestamp |
| **Settings** | | | | |
| `settings.profileVisibility` | Enum | ❌ | "Public" | `Public` or `Private` |
| `settings.contactVisible` | Boolean | ❌ | true | Show contact info |
| `settings.messageNotifications` | Boolean | ❌ | true | Receive message notifications |
| `settings.opportunityNotifications` | Boolean | ❌ | true | Receive opportunity notifications |
| `settings.emailNotifications` | Boolean | ❌ | true | Receive email notifications |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Creation timestamp |
| `updatedAt` | Date | ✅ | now() | Last update timestamp |

#### Index

- `email` - Unique index for email lookups

#### Notes

- Coaches store all their profile data directly in the User model (flat structure)
- Athletes extend User with the Athlete model (separate collection)
- Password is required minimum 6 characters during validation

---

### 4.2 Athlete Model

**File:** `backend/src/models/athlete.model.js`  
**Collection Name:** `athletes`

The `Athlete` model extends athlete-specific information.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `user` | ObjectId(User) | ✅ | - | Reference to User model (unique) |
| `dateOfBirth` | Date | ❌ | - | Date of birth |
| `gender` | Enum | ❌ | - | `male`, `female`, `other` |
| `phone` | String | ❌ | - | Contact number |
| `address.city` | String | ❌ | - | City |
| `address.state` | String | ❌ | - | State |
| `address.country` | String | ❌ | "India" | Country |
| `sport` | String | ✅ | - | Primary sport |
| `position` | String | ❌ | - | Playing position |
| `experience` | Number | ❌ | 0 | Years in sport |
| `achievements` | Array | ❌ | [] | Array of achievement objects |
| `achievements[].title` | String | ❌ | - | Achievement title |
| `achievements[].description` | String | ❌ | - | Achievement description |
| `achievements[].year` | Number | ❌ | - | Year achieved |
| `skills` | String[] | ❌ | [] | List of skills |
| `bio` | String | ❌ | - | Biography (max 500 chars) |
| `height` | Number | ❌ | - | Height in cm |
| `weight` | Number | ❌ | - | Weight in kg |
| `socialLinks.instagram` | String | ❌ | - | Instagram profile URL |
| `socialLinks.facebook` | String | ❌ | - | Facebook profile URL |
| `socialLinks.youtube` | String | ❌ | - | YouTube channel URL |
| `verificationStatus` | Enum | ❌ | "pending" | `pending`, `verified`, `rejected` |
| `isAvailable` | Boolean | ❌ | true | Availability for coaching |
| `settings.profileVisibility` | Enum | ❌ | "Public" | `Public` or `Private` |
| `settings.contactVisible` | Boolean | ❌ | true | Show contact info |
| `settings.messageNotifications` | Boolean | ❌ | true | Message notifications |
| `settings.opportunityNotifications` | Boolean | ❌ | true | Opportunity notifications |
| `settings.emailNotifications` | Boolean | ❌ | true | Email notifications |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Creation timestamp |
| `updatedAt` | Date | ✅ | now() | Last update timestamp |

#### Relationship

```
User (coach) ←→ Athlete ←→ Connection ←→ User (athlete)
```

---

### 4.3 Connection Model

**File:** `backend/src/models/connection.model.js`  
**Collection Name:** `connections`

Represents connection requests and relationships between coaches and athletes.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `coach` | ObjectId(User) | ✅ | - | Reference to coach User |
| `athlete` | ObjectId(User) | ✅ | - | Reference to athlete User |
| `status` | Enum | ✅ | "pending" | `pending`, `accepted`, `rejected`, `cancelled` |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Request creation time |
| `updatedAt` | Date | ✅ | now() | Last status update |

#### Indexes

- **Unique Index**: `(coach, athlete)` - Prevents duplicate connections

#### States

```
New Connection
    ↓
Pending (awaiting athlete response)
   ↙     ↘
Accepted  Rejected
   ↓
Connected
   ↓
Can be Cancelled/Disconnected
```

---

### 4.4 CoachAthlete Model

**File:** `backend/src/models/coachAthlete.model.js`  
**Collection Name:** `coachatletes`

**Note:** This model appears to be an alternative/legacy connection model. The primary connection management uses the `Connection` model.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `coach` | ObjectId(User) | ✅ | - | Reference to coach User |
| `athlete` | ObjectId(User) | ✅ | - | Reference to athlete User |
| `status` | Enum | ✅ | "pending" | `pending`, `accepted`, `rejected` |
| `requestedBy` | Enum | ✅ | - | `coach` or `athlete` |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Request creation time |
| `updatedAt` | Date | ✅ | now() | Last update |

#### Notes

- Also has unique index on `(coach, athlete)`
- Tracks who initiated the request (`requestedBy`)
- Routes exist but not actively used in frontend (may be legacy)

---

### 4.5 Showcase Model

**File:** `backend/src/models/showcase.model.js`  
**Collection Name:** `showcases`

Stores athlete media posts (images/videos).

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `athlete` | ObjectId(Athlete) | ✅ | - | Reference to athlete profile |
| `caption` | String | ❌ | - | Post caption (max 2000 chars) |
| `media` | Array | ❌ | [] | Array of media files |
| `media[].url` | String | ✅ | - | ImageKit URL |
| `media[].type` | Enum | ✅ | - | `image` or `video` |
| `media[].fileId` | String | ❌ | - | ImageKit file ID (for deletion) |
| `visibility` | Enum | ❌ | "public" | `public` or `private` |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Post creation time |
| `updatedAt` | Date | ✅ | now() | Last update time |

#### Notes

- Multiple media files can be attached to a single post
- Public posts visible to all; private posts hidden
- ImageKit file IDs stored for easy deletion

---

### 4.6 Conversation Model

**File:** `backend/src/models/conversation.model.js`  
**Collection Name:** `conversations`

Represents a chat conversation between two users.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `participants` | ObjectId(User)[] | ✅ | - | Array of 2 User IDs |
| `participantKey` | String | ✅ | - | Sorted string like "userId1_userId2" (unique) |
| `lastMessage` | ObjectId(Message) | ❌ | null | Reference to last message |
| `lastMessageAt` | Date | ❌ | null | Timestamp of last message |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Conversation start time |
| `updatedAt` | Date | ✅ | now() | Last activity |

#### Notes

- `participantKey` ensures A ↔ B and B ↔ A use the same conversation
- Deterministic key based on sorted participant IDs
- Only **accepted connections** can chat

---

### 4.7 Message Model

**File:** `backend/src/models/message.model.js`  
**Collection Name:** `messages`

Individual messages within a conversation.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `conversation` | ObjectId(Conversation) | ✅ | - | Reference to conversation |
| `sender` | ObjectId(User) | ✅ | - | Message sender |
| `receiver` | ObjectId(User) | ✅ | - | Message receiver |
| `text` | String | ✅ | - | Message content (max 2000 chars) |
| `read` | Boolean | ❌ | false | Read status |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Message creation time |
| `updatedAt` | Date | ✅ | now() | Last update |

#### Indexes

- Index on `(conversation, createdAt)` for efficient message retrieval

---

### 4.8 Sport Model

**File:** `backend/src/models/sport.model.js`  
**Collection Name:** `sports`

Reference data for available sports.

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | ✅ | - | Sport name (unique) |
| `description` | String | ❌ | - | Sport description |
| `icon` | String | ❌ | "" | Icon/image URL |
| `isActive` | Boolean | ❌ | true | Sport active status |
| **Metadata** | | | | |
| `createdAt` | Date | ✅ | now() | Creation time |
| `updatedAt` | Date | ✅ | now() | Last update |

#### Notes

- Not actively populated or used yet (foundation for future sport filtering)

---

### 4.9 Database Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         DATABASE SCHEMA                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                              User
                            /   |   \
                           /    |    \
                    Athlete    Coach   Admin
                      |         |
                      |         |
            Connection ←→ Connection
            (coach-athlete paired)
                      |
                      └─→ Showcase (media posts)
                      
            Conversation
            (between User 1 & User 2)
                      |
                      └─→ Message (many)


Key Relationships:
═════════════════

1. User → Athlete (1:1 unique)
   Athlete profile only for role="athlete"

2. User (coach) → Connection ← User (athlete)
   Connection defines coach-athlete relationship

3. Athlete → Showcase (1:many)
   One athlete can have many showcase posts

4. User ↔ User ← Conversation ← Message (1:many:many)
   Two users have conversation with many messages
```

---

## 5. Backend Architecture

### 5.1 Server Entry Point

**File:** `backend/server.js`

```javascript
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();  // Connect to MongoDB

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
```

- Loads Express app from `src/app.js`
- Connects to MongoDB
- Starts server on port 5000 (or env PORT)

### 5.2 Express App Setup

**File:** `backend/src/app.js`

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/coach-athletes", coachAthleteRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
```

### 5.3 Request Flow

```
Client Request (Axios)
    ↓
Express Route Handler
    ↓
Authentication Middleware (checks JWT)
    ↓
File Upload Middleware (if applicable)
    ↓
Controller Function
    ↓
Database Operation (MongoDB/Mongoose)
    ↓
Response Object
    ↓
Axios Response Handler
    ↓
React State Update
    ↓
UI Render
```

### 5.4 Middleware Stack

| Middleware | File | Purpose |
|-----------|------|---------|
| `cors()` | Express | Enable cross-origin requests |
| `express.json()` | Express | Parse JSON request bodies |
| `auth.middleware.js` | Custom | Verify JWT token in Authorization header |
| `upload.middleware.js` | Custom | Handle single image file upload (profile pic) |
| `showcaseUpload.middleware.js` | Custom | Handle multiple media files (up to 10) |

### 5.5 Directory Structure Summary

```
backend/src/
├── config/          → External service setup
├── middleware/      → Request processing
├── models/          → Data schemas
├── controllers/     → Business logic
└── routes/          → API endpoints
```

---

## 6. Frontend Architecture

### 6.1 React Entry Point

**File:** `frontend/src/main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 6.2 App Component & Routing

**File:** `frontend/src/App.jsx`

Main component that defines all routes using React Router.

#### Route Structure

```
/                          → Landing
/home                      → Home
/auth                      → Login/Register
/about, /contact, /help    → Info pages
/discover                  → Public discovery

/athlete/dashboard         → Athlete dashboard
/athlete/profile           → Athlete edit profile
/athlete/my-profile        → Athlete view own profile
/athlete/discover          → Coach discovery
/athlete/opportunities     → Opportunities page
/athlete/showcase          → Media showcase
/athlete/connections       → Coach connections
/athlete/messages          → Messaging
/athlete/settings          → Settings

/coach/dashboard           → Coach dashboard
/coach/profile             → Coach edit profile
/coach/my-profile          → Coach view own profile
/coach/athletes            → Connected athletes
/coach/discover            → Athlete discovery
/coach/requests            → Connection requests
/coach/messages            → Messaging
/coach/settings            → Settings

/profile/athlete/:athleteId     → View any athlete profile
/profile/coach/:coachId         → View any coach profile
/coach/athletes/:athleteId      → Coach viewing athlete
```

### 6.3 Component Architecture

```
App.jsx (Router)
│
├── Navbar (public pages)
│   ├── Logo
│   ├── Navigation buttons
│   └── Auth status
│
├── AthleteSidebar (athlete routes)
│   ├── Dashboard
│   ├── Profile
│   ├── Discover
│   ├── Opportunities
│   ├── Showcase
│   ├── Connections
│   ├── Messages
│   └── Settings
│
├── CoachSidebar (coach routes)
│   ├── Dashboard
│   ├── Profile
│   ├── Athletes
│   ├── Discover
│   ├── Opportunities
│   ├── Requests
│   ├── Messages
│   └── Settings
│
└── Pages
    ├── Public Pages (no auth required)
    ├── Athlete Pages (role-based)
    └── Coach Pages (role-based)
```

### 6.4 API Communication Layer

**File:** `frontend/src/services/auth.service.js`

```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {...}
export const loginUser = async (loginData) => {...}
```

All API calls made via Axios to backend at `http://localhost:5000/api/`

### 6.5 Authentication State Management

**Storage Location:** `localStorage`

```javascript
// After login
localStorage.setItem("token", data.token);           // JWT token
localStorage.setItem("user", JSON.stringify(data.user));  // User object
```

**Token Format:** `Bearer <jwt_token>`

**Token Expiration:** 7 days

### 6.6 Data Flow for Page Load

```
Page Component Mounts
    ↓
useEffect Hook
    ↓
Check localStorage for token
    ↓
If no token → navigate to /auth
    ↓
Make API request (with Authorization header)
    ↓
Backend verifies JWT
    ↓
Fetch data from database
    ↓
Return response
    ↓
Update React state
    ↓
Component re-renders with data
```

---

## 7. Authentication System

### 7.1 Registration Flow

```
User fills registration form
    ↓
Frontend validation (passwords match)
    ↓
POST /api/auth/register
    {
        name: string,
        email: string,
        password: string,
        role: "athlete" | "coach"
    }
    ↓
Backend: Check if email already exists
    ↓
Backend: Hash password with bcrypt (10 rounds)
    ↓
Backend: Create User document in MongoDB
    ↓
Response: {
    success: true,
    user: {
        id: ObjectId,
        name: string,
        email: string,
        role: string
    }
}
    ↓
Frontend: Show success message
    ↓
Frontend: Switch to login form
```

**Controller:** `auth.controller.js → registerUser()`

**Database Operation:** `User.create()`

### 7.2 Login Flow

```
User fills login form
    ↓
POST /api/auth/login
    {
        email: string,
        password: string
    }
    ↓
Backend: Find user by email
    ↓
Backend: Compare password with bcrypt
    ↓
Password valid? ❌ → Return 401 error
    ↓
Backend: Generate JWT token
    jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    ↓
Response: {
    message: "Login successful",
    token: "eyJhbGciOiJIUzI1NiIs...",
    user: {
        id: ObjectId,
        name: string,
        email: string,
        role: string
    }
}
    ↓
Frontend: Save token and user to localStorage
    ↓
Frontend: Redirect based on role
    - athlete → /athlete/dashboard
    - coach → /coach/dashboard
```

**Controller:** `auth.controller.js → loginUser()`

**Database Operations:**
- `User.findOne({ email })`
- `bcrypt.compare(password, hashedPassword)`
- `jwt.sign()`

### 7.3 Authentication Middleware

**File:** `backend/src/middleware/auth.middleware.js`

Applied to all protected routes.

```javascript
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
```

**Token Verification:**
- Extracts Bearer token from Authorization header
- Verifies signature with JWT_SECRET
- Decodes user ID and role
- Attaches to `req.user` for use in controller

### 7.4 Get Current User

**Endpoint:** `GET /api/auth/me`

**Required:** Authentication middleware

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
    ↓
Backend: Verify token (middleware)
    ↓
Backend: Find user by req.user.id
    ↓
Backend: Return user (excluding password)
    ↓
Frontend: Get user object
    ↓
Frontend: Update localStorage["user"]
```

**Controller:** `auth.controller.js → getCurrentUser()`

### 7.5 Password Management

#### Change Password

**Endpoint:** `PUT /api/auth/change-password`

**Required:** Authentication middleware

```
PUT /api/auth/change-password
{
    currentPassword: string,
    newPassword: string
}
    ↓
Backend: Get logged-in user
    ↓
Backend: Verify current password with bcrypt
    ↓
Backend: Check password != previous password
    ↓
Backend: Hash new password
    ↓
Backend: Update user document
    ↓
Response: Success message
```

### 7.6 Settings Management

#### Get Settings

**Endpoint:** `GET /api/auth/settings`

Returns user's notification and visibility settings.

#### Update Settings

**Endpoint:** `PUT /api/auth/settings`

```
PUT /api/auth/settings
{
    profileVisibility: "Public" | "Private",
    contactVisible: boolean,
    messageNotifications: boolean,
    opportunityNotifications: boolean,
    emailNotifications: boolean
}
    ↓
Backend: Update settings in user document
    ↓
Response: Updated user object
```

### 7.7 Security Analysis

✅ **Implemented:**
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication (7-day expiration)
- Protected routes with middleware
- CORS enabled
- Helmet security headers
- Token in Authorization header (not URL/cookies)

⚠️ **Considerations:**
- Token stored in localStorage (vulnerable to XSS) - consider httpOnly cookies
- No refresh token mechanism (7-day expiration)
- No rate limiting on auth endpoints
- No account lockout after failed login attempts
- Email verification (scaffolding present, not enforced)

---

## 8. API Documentation

### 8.1 Authentication Routes

**Base URL:** `http://localhost:5000/api/auth`

#### 1. Register User

```http
POST /auth/register
Content-Type: application/json

{
    "name": "John Athlete",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "athlete"
}

Response 201:
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Athlete",
        "email": "john@example.com",
        "role": "athlete"
    }
}

Error 400:
{
    "message": "User already exists"
}
```

#### 2. Login User

```http
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securePassword123"
}

Response 200:
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Athlete",
        "email": "john@example.com",
        "role": "athlete"
    }
}

Error 401:
{
    "message": "Invalid email or password"
}
```

#### 3. Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response 200:
{
    "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Athlete",
        "email": "john@example.com",
        "role": "athlete",
        "profilePic": "https://ik.imagekit.io/...",
        "settings": {
            "profileVisibility": "Public",
            "messageNotifications": true,
            ...
        },
        "createdAt": "2026-01-15T10:30:00Z",
        "updatedAt": "2026-01-15T10:30:00Z"
    }
}

Error 401:
{
    "message": "Access denied. No token provided."
}
```

#### 4. Change Password

```http
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
}

Response 200:
{
    "message": "Password changed successfully"
}

Error 400:
{
    "message": "Current password is incorrect"
}
```

#### 5. Get Settings

```http
GET /auth/settings
Authorization: Bearer <token>

Response 200:
{
    "settings": {
        "profileVisibility": "Public",
        "contactVisible": true,
        "messageNotifications": true,
        "opportunityNotifications": true,
        "emailNotifications": true
    }
}
```

#### 6. Update Settings

```http
PUT /auth/settings
Authorization: Bearer <token>
Content-Type: application/json

{
    "profileVisibility": "Private",
    "contactVisible": false,
    "messageNotifications": true,
    "opportunityNotifications": false,
    "emailNotifications": true
}

Response 200:
{
    "message": "Settings updated successfully",
    "user": { ... }
}
```

#### 7. Delete Account

```http
DELETE /auth/delete-account
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "Account deleted successfully"
}
```

**Backend Operation:**
- Deletes associated Athlete profile (if athlete)
- Deletes User document
- Loses all data and connections

---

### 8.2 Athlete Routes

**Base URL:** `http://localhost:5000/api/athletes`

#### 1. Create Athlete Profile

```http
POST /athletes/create
Authorization: Bearer <token>
Content-Type: application/json

{
    "sport": "Cricket",
    "position": "Batsman",
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "phone": "+91-9876543210",
    "address": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India"
    },
    "experience": 5,
    "skills": ["Batting", "Fielding", "Strategy"],
    "bio": "Professional cricket player",
    "height": 180,
    "weight": 75,
    "achievements": [
        {
            "title": "National Champion",
            "description": "Won national cricket tournament",
            "year": 2023
        }
    ],
    "socialLinks": {
        "instagram": "https://instagram.com/athlete",
        "facebook": "https://facebook.com/athlete",
        "youtube": "https://youtube.com/athlete"
    },
    "isAvailable": true
}

Response 201:
{
    "message": "Athlete profile created successfully",
    "athlete": { ... complete athlete object ... }
}

Error 400:
{
    "message": "Sport is required"
}
```

#### 2. Get My Athlete Profile

```http
GET /athletes/get-profile
Authorization: Bearer <token>

Response 200:
{
    "message": "Athlete profile fetched successfully",
    "athlete": { ... complete athlete object ... }
}

Error 404:
{
    "message": "Athlete profile not found"
}
```

#### 3. Update My Athlete Profile

```http
PUT /athletes/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
    "sport": "Cricket",
    "position": "All-rounder",
    "experience": 6,
    "bio": "Professional all-rounder cricket player",
    ... (partial updates supported)
}

Response 200:
{
    "message": "Athlete profile updated successfully",
    "athlete": { ... updated athlete object ... }
}
```

#### 4. Get All Athletes

```http
GET /athletes/get-all
Authorization: Bearer <token>

Response 200:
{
    "athletes": [ ... array of all athletes ... ]
}
```

#### 5. Get Athlete By ID

```http
GET /athletes/:id
Authorization: Bearer <token>

Response 200:
{
    "athlete": { ... athlete object ... }
}

Error 404:
{
    "message": "Athlete not found"
}
```

---

### 8.3 Coach Routes

**Base URL:** `http://localhost:5000/api/coaches`

#### 1. Get Coach Profile

```http
GET /coaches/get-profile
Authorization: Bearer <token>

Response 200:
{
    "coach": { ... coach user object ... }
}

Error 403:
{
    "message": "Access denied. Coach account required."
}
```

#### 2. Update Coach Profile

```http
PUT /coaches/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Coach Name",
    "phone": "+91-9876543210",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "sport": "Cricket",
    "specialization": "Batting",
    "experience": 15,
    "organization": "Elite Sports Academy",
    "achievements": ["Trained 20+ international players"],
    "skills": ["Batting Technique", "Mental Training"],
    "bio": "Experienced cricket coach",
    "isAvailable": true
}

Response 200:
{
    "message": "Coach profile updated successfully",
    "coach": { ... updated coach object ... }
}
```

---

### 8.4 User Routes

**Base URL:** `http://localhost:5000/api/users`

#### 1. Upload Profile Picture

```http
POST /users/profile-pic
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  profilePic: <image file>

Response 200:
{
    "message": "Profile picture uploaded successfully",
    "profilePic": "https://ik.imagekit.io/athlyx/profile-pics/..."
}

Error 400:
{
    "message": "Please select an image"
}
```

**Allowed Types:** JPG, JPEG, PNG, WEBP  
**Max Size:** 5MB

#### 2. Get All Coaches

```http
GET /users/coaches
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "sport": "Cricket",
    "coaches": [
        {
            "_id": "...",
            "name": "Coach Name",
            "profilePic": "...",
            "sport": "Cricket",
            "specialization": "Batting",
            "experience": 15,
            "organization": "Academy Name",
            "bio": "...",
            "address": { ... },
            "isAvailable": true
        },
        ...
    ]
}
```

**Logic:** Returns coaches matching athlete's sport

#### 3. Get Single Coach

```http
GET /users/coaches/:coachId
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "coach": { ... coach object ... }
}

Error 404:
{
    "message": "Coach not found"
}
```

---

### 8.5 Connection Routes

**Base URL:** `http://localhost:5000/api/connections`

#### 1. Send Connection Request (Coach → Athlete)

```http
POST /connections/send/:athleteId
Authorization: Bearer <token>

Response 200:
{
    "message": "Connection request sent successfully",
    "status": "pending",
    "connection": { ... connection object ... }
}

Error 400:
{
    "message": "Connection request already sent",
    "status": "pending"
}
```

#### 2. Check Connection Status (Coach → Athlete)

```http
GET /connections/status/:athleteId
Authorization: Bearer <token>

Response 200:
{
    "status": "pending" | "accepted" | "rejected" | "cancelled" | "none"
}
```

#### 3. Send Connection Request (Athlete → Coach)

```http
POST /connections/send/coach/:coachId
Authorization: Bearer <token>

Response 200:
{
    "message": "Connection request sent successfully",
    "status": "pending",
    "connection": { ... }
}
```

#### 4. Check Connection Status (Athlete → Coach)

```http
GET /connections/status/coach/:coachId
Authorization: Bearer <token>

Response 200:
{
    "status": "pending" | "accepted" | "rejected" | "none"
}
```

#### 5. Get Connection Requests (Athlete)

```http
GET /connections/athlete/requests
Authorization: Bearer <token>

Response 200:
{
    "requests": [
        {
            "_id": "...",
            "coach": { ... coach user object ... },
            "athlete": { ... athlete user object ... },
            "status": "pending",
            "createdAt": "..."
        },
        ...
    ]
}
```

#### 6. Respond to Connection Request

```http
PUT /connections/athlete/respond/:connectionId
Authorization: Bearer <token>
Content-Type: application/json

{
    "action": "accept" | "reject"
}

Response 200:
{
    "message": "Request accepted/rejected",
    "connection": { ... updated connection ... }
}
```

#### 7. Get Connected Athletes (Coach)

```http
GET /connections/coach/athletes
Authorization: Bearer <token>

Response 200:
{
    "athletes": [ ... array of connected athlete profiles ... ]
}
```

#### 8. Get Connected Coaches (Athlete)

```http
GET /connections/athlete/coaches
Authorization: Bearer <token>

Response 200:
{
    "coaches": [ ... array of connected coach profiles ... ]
}
```

#### 9. Disconnect

```http
DELETE /connections/disconnect/:connectionId
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "Disconnected successfully"
}
```

---

### 8.6 Showcase Routes

**Base URL:** `http://localhost:5000/api/showcase`

#### 1. Create Showcase Post

```http
POST /showcase/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  caption: "My winning performance at championship"
  visibility: "public" | "private"
  media: <file1, file2, ..., file10> (max 10 files)

Response 201:
{
    "success": true,
    "message": "Showcase post created successfully",
    "post": {
        "_id": "...",
        "athlete": "...",
        "caption": "...",
        "media": [
            {
                "url": "https://ik.imagekit.io/...",
                "type": "image",
                "fileId": "..."
            }
        ],
        "visibility": "public",
        "createdAt": "..."
    }
}

Error 400:
{
    "message": "Caption or media is required"
}
```

**Allowed Media Types:** JPG, JPEG, PNG, WEBP, MP4, WEBM, MOV  
**Max Size:** 50MB per file  
**Max Files:** 10

#### 2. Get My Showcase Posts

```http
GET /showcase/my-posts
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "posts": [ ... array of athlete's posts ... ]
}
```

#### 3. Get Athlete Public Showcase Posts

```http
GET /showcase/athlete/:athleteId
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "posts": [ ... array of public posts ... ]
}
```

#### 4. Update Showcase Post

```http
PUT /showcase/update/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  caption: "Updated caption"
  visibility: "public"
  media: <new files> (optional)

Response 200:
{
    "success": true,
    "message": "Showcase post updated successfully",
    "post": { ... updated post ... }
}
```

#### 5. Delete Showcase Post

```http
DELETE /showcase/delete/:id
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "Showcase post deleted successfully"
}
```

**Backend Operation:**
- Deletes media files from ImageKit
- Removes showcase document from database

---

### 8.7 Chat Routes

**Base URL:** `http://localhost:5000/api/chat`

#### 1. Create or Get Conversation

```http
POST /chat/conversation/:userId
Authorization: Bearer <token>

Response 200:
{
    "conversation": {
        "_id": "...",
        "participants": [ ... user objects ... ],
        "participantKey": "userId1_userId2",
        "lastMessage": { ... message object ... },
        "lastMessageAt": "..."
    }
}

Error 403:
{
    "message": "You can only chat with an accepted connection"
}
```

**Requirement:** Must have accepted connection with the user

#### 2. Get My Conversations

```http
GET /chat/conversations
Authorization: Bearer <token>

Response 200:
{
    "conversations": [
        {
            "_id": "...",
            "participants": [ ... ],
            "lastMessage": { ... },
            "unreadCount": 3,
            ...
        },
        ...
    ]
}
```

#### 3. Get Conversation Messages

```http
GET /chat/:conversationId/messages
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "messages": [
        {
            "_id": "...",
            "conversation": "...",
            "sender": { ... user object ... },
            "receiver": { ... user object ... },
            "text": "Message content",
            "read": false,
            "createdAt": "..."
        },
        ...
    ]
}
```

#### 4. Send Message

```http
POST /chat/:conversationId/message
Authorization: Bearer <token>
Content-Type: application/json

{
    "text": "Hello, I'm interested in your coaching",
    "receiverId": "..."
}

Response 201:
{
    "success": true,
    "message": {
        "_id": "...",
        "conversation": "...",
        "sender": "...",
        "receiver": "...",
        "text": "...",
        "read": false,
        "createdAt": "..."
    }
}
```

#### 5. Mark Messages as Read

```http
PUT /chat/:conversationId/read
Authorization: Bearer <token>

Response 200:
{
    "success": true,
    "message": "Messages marked as read"
}
```

---

### 8.8 API Response Patterns

#### Success Response (2xx)

```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "user": { ... },
    "token": "...",
    "count": 5
}
```

#### Error Response (4xx/5xx)

```json
{
    "success": false,
    "message": "Error description",
    "error": "Additional details"
}
```

#### Pagination
Not currently implemented. Returns all records.

#### Filtering
Performed client-side in most features.

---

## 9. Features Documentation

### 9.1 Feature: Authentication

**Status:** ✅ Fully Implemented

**Purpose:** Secure user registration, login, password management

#### Frontend Files
- `pages/Auth.jsx` - Login/Register UI
- `services/auth.service.js` - API calls

#### Backend Files
- `routes/auth.route.js`
- `controllers/auth.controller.js`
- `middleware/auth.middleware.js`

#### Database Models
- `User`

#### API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`
- `PUT /api/auth/change-email`
- `GET /api/auth/settings`
- `PUT /api/auth/settings`
- `DELETE /api/auth/delete-account`

#### Key Functions

**registerUser()**
- Validates input
- Checks existing email
- Hashes password with bcrypt (10 rounds)
- Creates User document
- Returns user object

**loginUser()**
- Finds user by email
- Verifies password with bcrypt
- Generates JWT token (7d expiration)
- Returns token and user

**getCurrentUser()**
- Verifies JWT token
- Returns user object (excludes password)

#### Current Status
- ✅ Register
- ✅ Login
- ✅ Get Current User
- ✅ Change Password
- ✅ Get/Update Settings
- ✅ Delete Account
- ⚠️ Email verification (scaffolding present, not enforced)

---

### 9.2 Feature: Athlete Profile Management

**Status:** ✅ Fully Implemented

**Purpose:** Athletes create, view, and update their profiles

#### Frontend Files
- `pages/Athlete-Pages/AthleteProfile.jsx` - Edit profile form
- `pages/Athlete-Pages/AthleteProfileView.jsx` - View own/other profiles
- `pages/Athlete-Pages/AthleteDashboard.jsx` - Dashboard with completion

#### Backend Files
- `routes/athlete.route.js`
- `controllers/athlete.controller.js`
- `models/athlete.model.js`

#### Database Models
- `Athlete` (extends User)

#### API Endpoints
- `POST /api/athletes/create`
- `GET /api/athletes/get-profile`
- `PUT /api/athletes/update-profile`
- `GET /api/athletes/get-all`
- `GET /api/athletes/:id`

#### Key Functions

**createAthlete()**
- Requires sport
- Creates Athlete document linked to User
- Stores detailed profile data

**updateMyAthleteProfile()**
- Allows partial updates
- Handles arrays (skills, achievements)
- Updates related fields

#### Important Features
- Profile completion percentage tracker
- Achievement logging with year
- Social media links
- Verification status (pending/verified/rejected)
- Address storage by city/state/country

#### Current Status
- ✅ Create athlete profile
- ✅ Edit profile
- ✅ View own profile
- ✅ View other athlete profiles
- ✅ Profile completion tracking
- ✅ Achievements logging

---

### 9.3 Feature: Coach Profile Management

**Status:** ✅ Fully Implemented

**Purpose:** Coaches create, view, and update their profiles

#### Frontend Files
- `pages/Coach-Pages/CoachProfile.jsx` - Edit profile form
- `pages/Coach-Pages/CoachProfileView.jsx` - View own/other profiles
- `pages/Coach-Pages/CoachDashboard.jsx` - Dashboard

#### Backend Files
- `routes/coach.route.js`
- `controllers/coach.controller.js`

#### Database Models
- `User` (role="coach")

**Note:** Coaches use the User model directly (flat structure), no separate Athlete model equivalent

#### API Endpoints
- `GET /api/coaches/get-profile`
- `PUT /api/coaches/update-profile`

#### Key Functions

**getCoachProfile()**
- Returns current user's coach data
- Validates coach role

**updateCoachProfile()**
- Updates: name, phone, address, sport, specialization, experience, organization, achievements, skills, bio, availability

#### Important Features
- Sport specialization
- Years of experience
- Organization affiliation
- Achievements list
- Skills list
- Availability status

#### Current Status
- ✅ Edit profile
- ✅ View own profile
- ✅ View other coach profiles
- ✅ Profile detail tracking

---

### 9.4 Feature: Profile Picture Upload

**Status:** ✅ Fully Implemented

**Purpose:** Users upload and manage profile pictures

#### Frontend Files
- `pages/Athlete-Pages/AthleteProfile.jsx` - Upload UI
- `pages/Coach-Pages/CoachProfile.jsx` - Upload UI

#### Backend Files
- `routes/user.route.js`
- `controllers/user.controller.js`
- `middleware/upload.middleware.js`

#### Middleware Details
```javascript
Multer Configuration:
- Storage: Memory (multer.memoryStorage())
- Allowed types: JPG, JPEG, PNG, WEBP
- Max file size: 5MB
```

#### API Endpoint
- `POST /api/users/profile-pic`

#### Flow
```
User selects image
    ↓
Frontend uploads via multipart/form-data
    ↓
Backend: multer parses file to memory
    ↓
Backend: Uploads to ImageKit
    ↓
Backend: Stores URL in User.profilePic
    ↓
Frontend: Displays new image
```

#### ImageKit Integration
- Folder: `/athlyx/profile-pics`
- Automatic optimization
- CDN served URLs

#### Current Status
- ✅ Upload profile picture
- ✅ Replace existing picture
- ✅ ImageKit integration

---

### 9.5 Feature: Athlete Discovery (for Coaches)

**Status:** ✅ Fully Implemented

**Purpose:** Coaches discover and connect with athletes

#### Frontend Files
- `pages/Coach-Pages/CoachDiscover.jsx` - Discovery page

#### Backend Files
- `routes/athlete.route.js`
- `controllers/athlete.controller.js`

#### API Endpoints
- `GET /api/athletes/get-all` - Get all athletes
- `GET /api/athletes/:id` - Get specific athlete

#### Features
- View all athletes
- Search by: name, sport, position, location, skills
- Display athlete cards with basic info
- See connection status
- Quick profile preview
- Sort by latest

#### Connection Integration
- Shows pending/accepted/no connection status
- "Send Connection" button
- "Connected" indicator for accepted connections

#### Current Status
- ✅ Discovery page
- ✅ Search functionality
- ✅ Connection status display
- ✅ Profile navigation

---

### 9.6 Feature: Coach Discovery (for Athletes)

**Status:** ✅ Fully Implemented

**Purpose:** Athletes discover and connect with coaches

#### Frontend Files
- `pages/Athlete-Pages/Discover.jsx` - Discovery page

#### Backend Files
- `routes/user.route.js` - `GET /users/coaches`
- `controllers/user.controller.js`

#### API Endpoints
- `GET /api/users/coaches` - Get matching coaches by sport
- `GET /api/users/coaches/:coachId` - Get specific coach

#### Features
- Coaches matched by athlete's sport
- Search coaches by: name, sport, specialization, organization, location
- Display coach cards
- Years of experience
- Organization/affiliation
- Available indicator

#### Filter Logic
```javascript
// Backend:
GET /users/coaches
→ Find athlete's profile
→ Get athlete's sport
→ Return coaches with matching sport
→ Sort by createdAt
```

#### Current Status
- ✅ Coach discovery
- ✅ Sport-based matching
- ✅ Search and filter
- ✅ Profile navigation

---

### 9.7 Feature: Connection System

**Status:** ✅ Fully Implemented

**Purpose:** Coach-athlete relationship management with request/acceptance workflow

#### Frontend Files
- `pages/Athlete-Pages/AthleteConnections.jsx` - Athlete connections
- `pages/Coach-Pages/CoachAthletes.jsx` - Coach's athletes
- `pages/Coach-Pages/CoachRequests.jsx` - Coach's requests

#### Backend Files
- `routes/connection.route.js`
- `controllers/connection.controller.js`
- `models/connection.model.js`

#### Database Model
```javascript
Connection {
    coach: ObjectId(User),
    athlete: ObjectId(User),
    status: "pending|accepted|rejected|cancelled",
    createdAt, updatedAt
}
```

#### API Endpoints
- `POST /api/connections/send/:athleteId` - Coach sends request
- `GET /api/connections/status/:athleteId` - Check status
- `POST /api/connections/send/coach/:coachId` - Athlete sends request
- `GET /api/connections/status/coach/:coachId` - Check status (athlete side)
- `GET /api/connections/athlete/requests` - Get requests for athlete
- `PUT /api/connections/athlete/respond/:connectionId` - Accept/reject
- `GET /api/connections/coach/athletes` - Get coach's connected athletes
- `GET /api/connections/athlete/coaches` - Get athlete's connected coaches
- `DELETE /api/connections/disconnect/:connectionId` - Disconnect

#### Connection States

```
No Connection (initial)
        ↓
Pending (coach/athlete initiates request)
    ↙       ↘
Accepted   Rejected
    ↓
Connected
    ↓
Can Disconnect (status change to cancelled)
```

#### Key Features
- Unique constraint: (coach, athlete) - prevents duplicate connections
- Can re-request after rejection
- Can only chat after acceptance
- Mutual connection management

#### Current Status
- ✅ Send connection requests
- ✅ View connection status
- ✅ Accept/reject requests
- ✅ View connected coaches/athletes
- ✅ Disconnect functionality
- ✅ Unique constraint enforcement

---

### 9.8 Feature: Showcase System

**Status:** ✅ Fully Implemented

**Purpose:** Athletes create media posts showcasing their performance

#### Frontend Files
- `pages/Athlete-Pages/Showcase.jsx` - Showcase management

#### Backend Files
- `routes/showcase.route.js`
- `controllers/showcase.controller.js`
- `middleware/showcaseUpload.middleware.js`
- `models/showcase.model.js`

#### Database Model
```javascript
Showcase {
    athlete: ObjectId(Athlete),
    caption: String (max 2000),
    media: [
        {
            url: String (ImageKit URL),
            type: "image|video",
            fileId: String (for deletion)
        }
    ],
    visibility: "public|private",
    createdAt, updatedAt
}
```

#### Middleware Details
```javascript
showcaseUpload.array("media", 10)
- Max files: 10
- Max file size: 50MB per file
- Allowed types:
  - Images: JPEG, JPG, PNG, WEBP
  - Videos: MP4, WEBM, MOV
- Storage: Memory (multer.memoryStorage())
```

#### API Endpoints
- `POST /api/showcase/create` - Create post with media
- `GET /api/showcase/my-posts` - Get athlete's posts
- `GET /api/showcase/athlete/:athleteId` - Get athlete's public posts
- `PUT /api/showcase/update/:id` - Update post
- `DELETE /api/showcase/delete/:id` - Delete post

#### Features
- Multiple media per post (images and videos)
- Caption support
- Public/private visibility
- Edit existing posts
- Delete with ImageKit cleanup
- Media type detection (auto-detects image vs video)

#### ImageKit Integration
```javascript
Upload folder: /athlyx/showcase
Process:
1. Read file from req.files
2. Upload to ImageKit
3. Get URL and fileId
4. Store in database
5. Clean files from memory
```

#### Current Status
- ✅ Create showcase posts
- ✅ Multiple media upload
- ✅ Edit posts
- ✅ Delete posts (with ImageKit cleanup)
- ✅ Visibility control (public/private)
- ✅ Public showcase viewing

---

### 9.9 Feature: Messaging System

**Status:** ✅ Fully Implemented

**Purpose:** Secure communication between connected coaches and athletes

#### Frontend Files
- `components/Messages.jsx` - Messaging UI
- `components/Messages.css` - Messaging styles

#### Backend Files
- `routes/chat.route.js`
- `controllers/chat.controller.js`
- `models/conversation.model.js`
- `models/message.model.js`

#### Database Models

**Conversation:**
```javascript
{
    participants: [ObjectId(User), ObjectId(User)],
    participantKey: "userId1_userId2" (sorted, unique),
    lastMessage: ObjectId(Message),
    lastMessageAt: Date
}
```

**Message:**
```javascript
{
    conversation: ObjectId(Conversation),
    sender: ObjectId(User),
    receiver: ObjectId(User),
    text: String (max 2000),
    read: Boolean,
    createdAt, updatedAt
}
```

#### API Endpoints
- `POST /api/chat/conversation/:userId` - Create or get conversation
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/:conversationId/messages` - Get messages
- `POST /api/chat/:conversationId/message` - Send message
- `PUT /api/chat/:conversationId/read` - Mark as read

#### Features
- Conversations between two users only
- Deterministic conversation key (order-independent)
- Last message tracking
- Message read status
- Unread count calculation
- Only chatting between accepted connections

#### Conversation Uniqueness
```javascript
// Ensures A ↔ B always uses same conversation:
participants = [userId1, userId2]
participantKey = "userId1_userId2" (sorted alphabetically)
```

#### Restrictions
```javascript
// Only allowed:
- Athlete ↔ Coach
- Coach ↔ Athlete

// Only after:
- Connection status = "accepted"
```

#### Current Status
- ✅ Create conversations
- ✅ Send messages
- ✅ Receive messages
- ✅ Read status tracking
- ✅ Conversation list
- ✅ Connection requirement enforcement

---

### 9.10 Feature: Opportunities

**Status:** ⚠️ Partially Implemented (Placeholder)

**Purpose:** Post and discover opportunities

#### Frontend Files
- `pages/Athlete-Pages/Opportunities.jsx` - Athlete opportunities (empty)
- `pages/Coach-Pages/CoachDiscover.jsx` - Note: labeled "Opportunities"

#### Backend Files
- No backend implementation

#### Current Status
- ❌ Not yet implemented
- 📝 Placeholder UI exists
- Backend structure needed: Opportunity model, routes, controllers

---

### 9.11 Feature: Settings & Notifications

**Status:** ✅ Partially Implemented

**Purpose:** User notification and privacy preferences

#### Frontend Files
- `pages/Athlete-Pages/Settings.jsx` - Athlete settings
- `pages/Coach-Pages/CoachSettings.jsx` - Coach settings

#### Backend Files
- `routes/auth.route.js` - Settings endpoints
- `controllers/auth.controller.js`

#### Database Storage
In User model:
```javascript
settings: {
    profileVisibility: "Public|Private",
    contactVisible: Boolean,
    messageNotifications: Boolean,
    opportunityNotifications: Boolean,
    emailNotifications: Boolean
}
```

#### API Endpoints
- `GET /api/auth/settings` - Get settings
- `PUT /api/auth/settings` - Update settings

#### Current Status
- ✅ Get settings
- ✅ Update settings
- ✅ Settings stored in database
- ⚠️ Settings not actively enforced (visibility, notifications)

---

## 10. User Roles

### 10.1 Athlete Role

**Status:** ✅ Fully Implemented

**Access Paths:**
- Dashboard: `/athlete/dashboard`
- Profile: `/athlete/profile`
- Discover: `/athlete/discover` (coaches by sport)
- Showcase: `/athlete/showcase` (media posts)
- Connections: `/athlete/connections` (connected coaches)
- Messages: `/athlete/messages`
- Settings: `/athlete/settings`

**Capabilities:**
- Create and manage profile
- Search and discover coaches in their sport
- Send connection requests to coaches
- Accept/reject coach connection requests
- View connected coaches
- Message connected coaches
- Create showcase posts (images/videos)
- Upload profile picture
- Manage settings and notifications

**Restrictions:**
- Cannot view other athletes' private profiles
- Cannot message unconnected coaches
- Cannot access coach-specific features

---

### 10.2 Coach Role

**Status:** ✅ Fully Implemented

**Access Paths:**
- Dashboard: `/coach/dashboard`
- Profile: `/coach/profile`
- Athletes: `/coach/athletes` (connected athletes)
- Discover: `/coach/discover` (all athletes)
- Requests: `/coach/requests` (connection requests)
- Messages: `/coach/messages`
- Settings: `/coach/settings`

**Capabilities:**
- Create and manage profile
- Search and discover all athletes
- Send connection requests to athletes
- Accept/reject athlete connection requests
- View connected athletes with details
- Message connected athletes
- Upload profile picture
- Manage settings and notifications

**Restrictions:**
- Cannot view other coaches' profiles
- Cannot see athlete showcase (private content)
- Cannot message unconnected athletes

---

### 10.3 Scout Role

**Status:** 📝 Planned (Scaffolding Present)

**Implementation Status:**
- User model supports role
- Route placeholders exist
- Frontend route exists but no page component
- Backend controllers not implemented

---

### 10.4 Academy Role

**Status:** 📝 Planned (Scaffolding Present)

**Implementation Status:**
- User model supports role
- Route placeholders exist
- Frontend route exists but no page component
- Backend controllers not implemented

---

### 10.5 Admin Role

**Status:** 📝 Planned (Scaffolding Present)

**Implementation Status:**
- User model supports role
- No routes, controllers, or pages
- Foundation only

---

## 11. File-by-File Documentation

### 11.1 Backend Controllers

#### auth.controller.js

**Purpose:** Handle authentication logic (register, login, password management, settings)

**Key Functions:**

1. **registerUser(req, res)**
   - Input: name, email, password, role
   - Validates: email unique, passwords match
   - Process: Hash password, create User
   - Output: User object (no password)

2. **loginUser(req, res)**
   - Input: email, password
   - Process: Find user, verify password, generate JWT
   - Output: token (7d expiration), user object

3. **getCurrentUser(req, res)**
   - Input: JWT from auth middleware
   - Process: Fetch user from DB
   - Output: User object (no password)

4. **changePassword(req, res)**
   - Input: currentPassword, newPassword
   - Process: Verify current, hash new, update
   - Output: Success message

5. **deleteAccount(req, res)**
   - Input: User ID from token
   - Process: Delete Athlete (if athlete), delete User
   - Output: Success message

6. **getSettings(req, res)**
   - Output: User settings object

7. **updateSettings(req, res)**
   - Input: Partial settings object
   - Process: Merge with existing settings
   - Output: Updated user

---

#### athlete.controller.js

**Purpose:** Manage athlete profiles

**Key Functions:**

1. **createAthlete(req, res)**
   - Input: Sport (required), other profile data
   - Validation: Sport required, unique user-athlete relation
   - Output: Athlete object

2. **getMyAthleteProfile(req, res)**
   - Finds athlete by user ID
   - Output: Athlete object with populated user

3. **updateMyAthleteProfile(req, res)**
   - Partial updates supported
   - Handles arrays (skills, achievements)
   - Output: Updated athlete object

4. **getAllAthletes(req, res)**
   - Returns all athletes
   - Output: Array of athlete objects

5. **getAthleteById(req, res)**
   - Get specific athlete by ID
   - Output: Athlete object

---

#### coach.controller.js

**Purpose:** Manage coach profiles

**Key Functions:**

1. **getCoachProfile(req, res)**
   - Returns current coach's user object
   - Output: Coach (User) object

2. **updateCoachProfile(req, res)**
   - Updates: name, phone, address, sport, specialization, experience, organization, achievements, skills, bio, isAvailable
   - Output: Updated user object

---

#### user.controller.js

**Purpose:** User utilities (profile pictures, coach discovery)

**Key Functions:**

1. **uploadProfilePic(req, res)**
   - Input: Image file (multipart)
   - Process: Upload to ImageKit, update user.profilePic
   - Output: Profile picture URL

2. **getAllCoaches(req, res)**
   - Logic: Get athlete's sport, return coaches with same sport
   - Output: Array of coach objects

3. **getCoachById(req, res)**
   - Get specific coach
   - Output: Coach user object (no password/OTP)

---

#### connection.controller.js

**Purpose:** Manage coach-athlete connections

**Key Functions:**

1. **sendConnectionRequest(req, res)**
   - Coach → Athlete
   - Checks: coach exists, athlete exists, no duplicate/accepted
   - Handles: Re-request after rejection
   - Output: Connection object

2. **sendAthleteConnectionRequest(req, res)**
   - Athlete → Coach (if needed)

3. **getCoachConnectionStatus(req, res)**
   - Returns: "pending", "accepted", "rejected", "none"

4. **getAthleteConnectionRequests(req, res)**
   - Returns: Array of pending requests for athlete

5. **respondToConnectionRequest(req, res)**
   - Input: connectionId, action ("accept"/"reject")
   - Updates status
   - Output: Updated connection

6. **getCoachConnectedAthletes(req, res)**
   - Returns: Array of athletes with status="accepted"

7. **getAthleteConnectedCoaches(req, res)**
   - Returns: Array of coaches with status="accepted"

8. **disconnectConnection(req, res)**
   - Soft delete (status → "cancelled")
   - Output: Success message

---

#### showcase.controller.js

**Purpose:** Manage athlete media showcases

**Key Functions:**

1. **createShowcasePost(req, res)**
   - Input: caption, visibility, files (multipart)
   - Process: Upload files to ImageKit, create Showcase document
   - Output: Showcase object

2. **getMyShowcasePosts(req, res)**
   - Returns: All posts by current athlete
   - Sorted: createdAt descending

3. **getAthletePublicShowcasePosts(req, res)**
   - Returns: Public posts only (visibility="public")

4. **updateShowcasePost(req, res)**
   - Updates: caption, visibility
   - Can add/replace media
   - Output: Updated showcase

5. **deleteShowcasePost(req, res)**
   - Deletes media from ImageKit
   - Removes document
   - Output: Success message

---

#### chat.controller.js

**Purpose:** Manage messaging and conversations

**Key Functions:**

1. **getOrCreateConversation(req, res)**
   - Creates conversation if not exists
   - Validates: accepted connection required
   - Deterministic key: ensures uniqueness
   - Output: Conversation object

2. **getMyConversations(req, res)**
   - Returns: All conversations for user
   - Includes: unread count per conversation
   - Sorted: lastMessageAt descending

3. **getConversationMessages(req, res)**
   - Returns: All messages in conversation
   - Output: Array of message objects

4. **sendMessage(req, res)**
   - Input: text, receiverId (in body)
   - Updates: conversation.lastMessage, lastMessageAt
   - Output: Message object

5. **markMessagesAsRead(req, res)**
   - Sets: message.read = true for receiver's unread messages
   - Output: Success message

---

### 11.2 Backend Middleware

#### auth.middleware.js

**Purpose:** Verify JWT token on protected routes

**Process:**
1. Extract "Bearer <token>" from Authorization header
2. Verify signature with JWT_SECRET
3. Decode user ID and role
4. Attach to req.user
5. Call next() or return 401 error

**Usage:** Applied to all routes requiring authentication

---

#### upload.middleware.js

**Purpose:** Handle single image upload for profile pictures

**Configuration:**
```javascript
- Storage: Memory (multer.memoryStorage())
- File filter: JPG, JPEG, PNG, WEBP only
- Max size: 5MB
```

**Usage:** `router.post("/profile-pic", upload.single("profilePic"), ...)`

---

#### showcaseUpload.middleware.js

**Purpose:** Handle multiple media uploads for showcase posts

**Configuration:**
```javascript
- Storage: Memory
- File filter: Images (JPG, PNG, WEBP) + Videos (MP4, WEBM, MOV)
- Max size: 50MB per file
- Max files: 10
```

**Usage:** `router.post("/create", showcaseUpload.array("media", 10), ...)`

---

### 11.3 Backend Routes

#### auth.route.js
- `POST /register` → registerUser
- `POST /login` → loginUser
- `GET /me` (protected) → getCurrentUser
- `DELETE /delete-account` (protected) → deleteAccount
- `PUT /change-password` (protected) → changePassword
- `PUT /change-email` (protected) → changeEmail
- `GET /settings` (protected) → getSettings
- `PUT /settings` (protected) → updateSettings

#### athlete.route.js
- `POST /create` (protected) → createAthlete
- `GET /get-profile` (protected) → getMyAthleteProfile
- `PUT /update-profile` (protected) → updateMyAthleteProfile
- `GET /get-all` → getAllAthletes
- `GET /:id` (protected) → getAthleteById

#### coach.route.js
- `GET /get-profile` (protected) → getCoachProfile
- `PUT /update-profile` (protected) → updateCoachProfile

#### user.route.js
- `POST /profile-pic` (protected) → uploadProfilePic (with upload middleware)
- `GET /coaches` (protected) → getAllCoaches
- `GET /coaches/:coachId` (protected) → getCoachById

#### connection.route.js
- `POST /send/:athleteId` (protected) → sendConnectionRequest (coach)
- `GET /status/:athleteId` (protected) → getCoachConnectionStatus
- `POST /send/coach/:coachId` (protected) → sendAthleteConnectionRequest
- `GET /status/coach/:coachId` (protected) → getAthleteConnectionStatus
- `GET /athlete/requests` (protected) → getAthleteConnectionRequests
- `PUT /athlete/respond/:connectionId` (protected) → respondToConnectionRequest
- `GET /coach/requests` (protected) → getCoachConnectionRequests
- `GET /coach/athletes` (protected) → getCoachConnectedAthletes
- `GET /athlete/coaches` (protected) → getAthleteConnectedCoaches
- `DELETE /disconnect/:connectionId` (protected) → disconnectConnection

#### showcase.route.js
- `POST /create` (protected, showcaseUpload) → createShowcasePost
- `GET /my-posts` (protected) → getMyShowcasePosts
- `GET /athlete/:athleteId` (protected) → getAthletePublicShowcasePosts
- `PUT /update/:id` (protected, showcaseUpload) → updateShowcasePost
- `DELETE /delete/:id` (protected) → deleteShowcasePost

#### chat.route.js
- `POST /conversation/:userId` (protected) → getOrCreateConversation
- `GET /conversations` (protected) → getMyConversations
- `GET /:conversationId/messages` (protected) → getConversationMessages
- `POST /:conversationId/message` (protected) → sendMessage
- `PUT /:conversationId/read` (protected) → markMessagesAsRead

---

### 11.4 Frontend Pages

#### Auth.jsx
- **Purpose:** Login and registration UI
- **State:** isLogin toggle, formData, loading, error, success
- **Features:** 
  - Toggle between login and register
  - Form validation (password confirmation)
  - Role selection (athlete/coach)
  - Error/success messages
  - Navigation after login based on role

#### Landing.jsx
- **Purpose:** Welcome/landing page
- **Features:** Hero section, CTA buttons

#### Home.jsx
- **Purpose:** Public home page (after navbar)
- **Features:** Overview, navigation

#### Discover.jsx
- **Purpose:** Public discovery page (not role-specific)

#### Navbar.jsx
- **Purpose:** Public header navigation
- **Items:** Home, Discover, About, Contact, Help, Auth

---

#### AthleteDashboard.jsx
- **Purpose:** Athlete main dashboard
- **Features:**
  - Profile completion percentage
  - Quick stats
  - Navigation shortcuts
  - Profile setup guidance
- **State:** user, athlete, loading, completion percentage

#### AthleteProfile.jsx
- **Purpose:** Athlete edit profile page
- **Features:**
  - Edit all profile fields
  - Upload profile picture
  - Add achievements
  - Form validation
  - Success/error messages

#### AthleteProfileView.jsx
- **Purpose:** View athlete profile (own or others)
- **Features:**
  - Display profile data
  - Edit mode for own profile
  - Connection status
  - Action buttons

#### AthleteDiscover.jsx
- **Purpose:** Athlete discovers coaches by sport
- **Features:**
  - Search coaches
  - Filter by sport
  - Coach cards with details
  - Send connection button
  - Connection status display

#### AthleteConnections.jsx
- **Purpose:** Athlete's connected coaches
- **Features:**
  - List of coaches
  - Connection status
  - Message button
  - Disconnect option

#### Showcase.jsx
- **Purpose:** Athlete's media showcase management
- **Features:**
  - Create post with caption
  - Upload multiple media (images/videos)
  - Set visibility (public/private)
  - Edit existing posts
  - Delete posts
  - Preview media

#### Settings.jsx
- **Purpose:** Athlete settings
- **Features:**
  - Notification preferences
  - Privacy settings
  - Profile visibility
  - Contact preferences

---

#### CoachDashboard.jsx
- **Purpose:** Coach main dashboard
- **Features:** Quick stats, athlete count, messaging

#### CoachProfile.jsx
- **Purpose:** Coach edit profile page
- **Features:** Edit all profile fields, upload picture

#### CoachProfileView.jsx
- **Purpose:** View coach profile (own or others)

#### CoachDiscover.jsx
- **Purpose:** Coach discovers all athletes
- **Features:**
  - Search athletes
  - Filter by: name, sport, position, location, skills
  - Athlete cards
  - Connection status checking
  - Send connection button
  - Load all athletes (GET /api/athletes/get-all)

#### CoachAthletes.jsx
- **Purpose:** Coach's connected athletes
- **Features:**
  - List of connected athletes
  - Athlete details
  - Message button

#### CoachRequests.jsx
- **Purpose:** Coach's pending connection requests
- **Features:**
  - Athlete requests to coach
  - Accept/reject buttons

---

### 11.5 Frontend Components

#### Navbar.jsx
- Public header with logo and navigation
- Routes: Home, Discover, About, Contact, Help

#### AthleteSidebar.jsx
- Icon-only sidebar for athlete routes
- Tooltip on hover
- Active route highlighting
- Items: Dashboard, Profile, Discover, Opportunities, Showcase, Connections, Messages, Settings

#### CoachSidebar.jsx
- Icon-only sidebar for coach routes
- Items: Dashboard, Profile, Athletes, Discover, Opportunities, Requests, Messages, Settings

#### Messages.jsx
- Messaging component
- Conversation list
- Message thread
- Send message UI
- Unread count

#### SpecularButton.jsx
- Reusable button component

#### AthleteResume.jsx
- Display athlete profile data
- (May be used in multiple places or unused)

---

### 11.6 Frontend Services

#### auth.service.js

**API Base:** `http://localhost:5000/api/`

**Exports:**
- `registerUser(userData)` → POST /auth/register
- `loginUser(loginData)` → POST /auth/login

**Headers:** `{ "Content-Type": "application/json" }`

---

### 11.7 Styling Files

#### App.css
- Global app styles
- Layout styling
- Component styling

#### Messages.css
- Messaging UI styles

#### index.css
- Global styles
- CSS variables
- Typography
- Colors
- Layout utilities

---

## 12. Data Flow Diagrams

### 12.1 Registration Flow

```
User → Auth Page
    ↓
Fill form (name, email, password, role)
    ↓
Frontend validation (password match)
    ↓
POST /api/auth/register
    ↓
Backend: Check email exists
    ↓
Backend: Hash password (bcrypt)
    ↓
User.create() → MongoDB
    ↓
Return user object
    ↓
Frontend: Show success
    ↓
Switch to login form
```

---

### 12.2 Login Flow

```
User → Auth Page
    ↓
Fill form (email, password)
    ↓
POST /api/auth/login
    ↓
Backend: Find user by email
    ↓
Backend: bcrypt.compare(password)
    ↓
Generate JWT (7d expiration)
    ↓
Return: { token, user }
    ↓
Frontend: localStorage.setItem("token", token)
Frontend: localStorage.setItem("user", user)
    ↓
Navigate based on role
    ├─ athlete → /athlete/dashboard
    └─ coach → /coach/dashboard
```

---

### 12.3 Athlete Profile Creation Flow

```
Athlete → /athlete/profile
    ↓
Get existing profile (404 = create new)
    ↓
Fill profile form (sport required)
    ↓
POST /api/athletes/create
    ↓
Backend: Validate sport
    ↓
Backend: Check unique user-athlete
    ↓
Athlete.create() → MongoDB
    ↓
Return athlete object
    ↓
Frontend: Show success
    ↓
localStorage.user updated
    ↓
Redirect to dashboard
```

---

### 12.4 Profile Picture Upload Flow

```
User → Profile Page
    ↓
Click upload button
    ↓
Select image (JPG/PNG/WEBP, max 5MB)
    ↓
Frontend displays preview
    ↓
Click save
    ↓
POST /api/users/profile-pic
    (multipart/form-data)
    ↓
Backend: multer reads file to memory
    ↓
Backend: imagekit.upload()
    ↓
Get ImageKit URL
    ↓
User.profilePic = url
    ↓
Save to MongoDB
    ↓
Return new profilePic URL
    ↓
Frontend: Update displayed image
    ↓
localStorage.user.profilePic updated
```

---

### 12.5 Coach Discovery (Athlete) Flow

```
Athlete → /athlete/discover
    ↓
useEffect: GET /api/users/coaches
    ↓
Backend: Find athlete's profile
    ↓
Get athlete's sport
    ↓
Find coaches with matching sport
    ↓
Return coaches array
    ↓
Frontend: Display coach cards
    ↓
User searches/filters coaches
    ↓
Frontend: Filter client-side
    ↓
Click coach card
    ↓
Navigate to /profile/coach/:coachId
    ↓
View coach details
    ↓
Click "Connect" button
    ↓
POST /api/connections/send/coach/:coachId
    ↓
Create Connection document
    ↓
Status = "pending"
    ↓
Show success message
```

---

### 12.6 Connection Request Flow (Coach → Athlete)

```
Coach → /coach/discover
    ↓
GET /api/athletes/get-all
    ↓
Display all athletes
    ↓
Coach searches/filters
    ↓
Click athlete card
    ↓
View athlete profile
    ↓
Click "Send Connection"
    ↓
POST /api/connections/send/:athleteId
    ↓
Backend: Validate coach exists
    ↓
Backend: Validate athlete exists
    ↓
Backend: Check no duplicate/accepted
    ↓
Connection.create({
    coach: coachId,
    athlete: athleteUserId,
    status: "pending"
})
    ↓
Return connection object
    ↓
Frontend: Show "Pending"
    ↓
---
Athlete receives request
    ↓
Athlete → /athlete/connections (requests tab)
    ↓
GET /api/connections/athlete/requests
    ↓
Show pending requests
    ↓
Click accept/reject
    ↓
PUT /api/connections/athlete/respond/:connectionId
    {action: "accept"}
    ↓
Update status to "accepted"
    ↓
Both can now message each other
```

---

### 12.7 Showcase Post Creation Flow

```
Athlete → /athlete/showcase
    ↓
Click "Create Post"
    ↓
Fill caption (optional)
    ↓
Select media (images/videos, max 10, 50MB each)
    ↓
Set visibility (public/private)
    ↓
Preview media
    ↓
Click create
    ↓
POST /api/showcase/create
    (multipart/form-data)
    ↓
Backend: multer reads files to memory
    ↓
Loop through files:
    ├─ imagekit.upload()
    ├─ Get URL and fileId
    └─ Detect type (image/video)
    ↓
Showcase.create({
    athlete: athleteId,
    caption: caption,
    media: [...],
    visibility: visibility
})
    ↓
Clear files from memory
    ↓
Return showcase object
    ↓
Frontend: Add to posts list
    ↓
Show success message
```

---

### 12.8 Messaging Flow

```
Connected coach/athlete → /messages
    ↓
GET /api/chat/conversations
    ↓
Display conversation list
    ↓
Click conversation
    ↓
POST /api/chat/conversation/:userId (if new)
    or GET existing
    ↓
Create/get Conversation
    ↓
GET /api/chat/:conversationId/messages
    ↓
Load message thread
    ↓
Display messages
    ↓
Type message
    ↓
Click send
    ↓
POST /api/chat/:conversationId/message
    {text: "message", receiverId: "..."}
    ↓
Create Message document
    ↓
Update Conversation.lastMessage
    ↓
Update Conversation.lastMessageAt
    ↓
Return message object
    ↓
Frontend: Add to message list
    ↓
---
Receiver opens chat
    ↓
PUT /api/chat/:conversationId/read
    ↓
Mark messages as read
    ↓
Unread count = 0
```

---

## 13. Routing Map

### 13.1 Complete Route Tree

```
ROOT /
│
├── PUBLIC ROUTES (no auth required)
│   ├── / → Landing
│   ├── /home → Home
│   ├── /auth → Auth (Login/Register)
│   ├── /about → About
│   ├── /contact → Contact
│   ├── /help → Help
│   └── /discover → Discover (public)
│
├── ATHLETE ROUTES (role="athlete", auth required)
│   ├── /athlete/dashboard → AthleteDashboard
│   ├── /athlete/profile → AthleteProfile (edit)
│   ├── /athlete/my-profile → AthleteProfileView (view own)
│   ├── /athlete/discover → Discover (coaches by sport)
│   ├── /athlete/opportunities → Opportunities (placeholder)
│   ├── /athlete/showcase → Showcase
│   ├── /athlete/connections → AthleteConnections
│   └── /athlete/messages → Messages
│   └── /athlete/settings → Settings
│
├── COACH ROUTES (role="coach", auth required)
│   ├── /coach/dashboard → CoachDashboard
│   ├── /coach/profile → CoachProfile (edit)
│   ├── /coach/my-profile → CoachProfileView (view own)
│   ├── /coach/athletes → CoachAthletes (connected)
│   ├── /coach/discover → CoachDiscover (all athletes)
│   ├── /coach/opportunities → Opportunities (placeholder)
│   ├── /coach/requests → CoachRequests (pending)
│   ├── /coach/messages → Messages
│   └── /coach/settings → CoachSettings
│
└── SHARED/DYNAMIC ROUTES
    ├── /profile/athlete/:athleteId → AthleteProfileView (view any)
    ├── /profile/coach/:coachId → CoachProfileView (view any)
    ├── /coach/athletes/:athleteId → AthleteProfileView (coach viewing)
```

---

## 14. Components Documentation

### 14.1 Navbar.jsx

**Purpose:** Public header navigation

**Props:** None

**Features:**
- Logo click → /home
- Navigation buttons
- Active route highlighting
- Responsive (assumed)

**Navigation Items:**
- Home
- Discover
- About
- Contact
- Help

---

### 14.2 AthleteSidebar.jsx

**Purpose:** Athlete navigation sidebar

**Style:** Icon-only with tooltip on hover

**Navigation Items:**
- Dashboard (`/athlete/dashboard`)
- My Profile (`/athlete/my-profile`)
- Discover (`/athlete/discover`)
- Opportunities (`/athlete/opportunities`)
- Showcase (`/athlete/showcase`)
- Connections (`/athlete/connections`)
- Messages (`/athlete/messages`)
- Settings (`/athlete/settings`)

---

### 14.3 CoachSidebar.jsx

**Purpose:** Coach navigation sidebar

**Navigation Items:**
- Dashboard (`/coach/dashboard`)
- My Profile (`/coach/my-profile`)
- My Athletes (`/coach/athletes`)
- Discover Athletes (`/coach/discover`)
- Opportunities (`/coach/opportunities`)
- Requests (`/coach/requests`)
- Messages (`/coach/messages`)
- Settings (`/coach/settings`)

---

### 14.4 Messages.jsx

**Purpose:** Chat interface component

**Features:**
- Conversation list
- Message thread
- Send message input
- Unread count

**Props:** (inferred from usage)
- Likely receives conversationId as parameter or state

---

### 14.5 SpecularButton.jsx

**Purpose:** Reusable button component

**Expected Props:** onClick, children, className, disabled, type

---

### 14.6 AthleteResume.jsx

**Purpose:** Display athlete profile card/summary

**Displays:** Profile picture, name, sport, position, location, achievements

---

## 15. Configuration & Environment

### 15.1 Environment Variables

**Backend (.env required)**

```env
# MongoDB
MONGO_URI=mongodb://...

# JWT
JWT_SECRET=your_jwt_secret_key_here

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/youraccountname/

# Server
PORT=5000 (optional, default 5000)

# Email (configured, not used)
SENDGRID_API_KEY=...
RESEND_API_KEY=...
```

**Frontend**

- **API Base URL:** Hardcoded to `http://localhost:5000/api/`
- No .env file used (should be added for different environments)

### 15.2 Development Setup

**Start Development:**

```bash
# Root directory
npm run dev
```

This runs concurrently:
- Backend: `npm run dev --prefix backend` (nodemon on server.js)
- Frontend: `npm run dev --prefix frontend` (Vite dev server)

**Backend:**
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (Vite default)
```

### 15.3 Production Setup

**Build Frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Start Backend:**
```bash
cd backend
npm run start
# Runs on PORT (env var)
```

---

## 16. Security Analysis

### 16.1 Implemented Security Measures

✅ **Password Security**
- Hashed with bcrypt (10 rounds)
- Minimum 6 characters required
- Compare using bcrypt.compare()

✅ **JWT Authentication**
- Token-based (not session)
- 7-day expiration
- Verified on every protected request
- Extracted from Authorization header

✅ **Protected Routes**
- Auth middleware checks JWT on backend
- Protected routes: all API endpoints except register/login
- Frontend localStorage checks before navigation

✅ **CORS**
- Enabled with default settings
- Allows cross-origin requests

✅ **Security Headers**
- Helmet middleware configured
- Adds various security headers

✅ **Data Validation**
- Backend validates input
- Email checked for uniqueness
- Sport required for athlete profiles

✅ **Unique Constraints**
- Email unique index
- User-Athlete one-to-one
- Coach-Athlete pair uniqueness

---

### 16.2 Security Considerations & Gaps

⚠️ **Potential Vulnerabilities**

| Issue | Risk | Mitigation |
|-------|------|-----------|
| Token in localStorage | XSS can steal token | Use httpOnly cookies instead |
| No refresh tokens | 7d is long expiration | Implement refresh token rotation |
| No rate limiting | Brute force attacks | Add rate limiting middleware |
| No account lockout | Password guessing | Implement lockout after N attempts |
| Passwords not required | Weak passwords possible | Enforce stronger password rules |
| No email verification | Anyone can register | Implement OTP verification (scaffolding exists) |
| CORS default settings | May allow all origins | Restrict to specific frontend URL |
| File upload validation | Potential abuse | Validate file types and sizes strictly |
| No HTTPS enforced | Man-in-the-middle attacks | Use HTTPS in production |
| No input sanitization | XSS/Injection attacks | Sanitize user inputs |
| Passwords in some responses | Accidental leaks | Always exclude password from responses |

---

### 16.3 Recommended Improvements

1. **Use httpOnly Cookies** instead of localStorage for tokens
2. **Implement Refresh Token Flow** with short-lived access tokens
3. **Add Rate Limiting** to auth endpoints (brute force protection)
4. **Enforce Email Verification** using OTP
5. **Add Password Strength Requirements** (uppercase, lowercase, numbers, special chars)
6. **Implement Account Lockout** after failed login attempts
7. **Add Input Sanitization** (prevent XSS/injection)
8. **Restrict CORS** to specific frontend origin
9. **Use HTTPS** in production
10. **Add Helmet.js** with strict configuration
11. **Implement SQL/NoSQL Injection Prevention**
12. **Add File Upload Scanning** (malware detection)

---

## 17. Implementation Status

### Feature Implementation Matrix

| Feature | Frontend | Backend | Database | Status |
|---------|----------|---------|----------|--------|
| **Authentication** | ✅ | ✅ | ✅ | Complete |
| → Register | ✅ | ✅ | ✅ | ✅ |
| → Login | ✅ | ✅ | ✅ | ✅ |
| → Logout | ✅ | ❌ | ❌ | Frontend only |
| → Password Change | ✅ | ✅ | ✅ | ✅ |
| → Settings | ✅ | ✅ | ✅ | Partial (not enforced) |
| **Athlete Profile** | ✅ | ✅ | ✅ | Complete |
| → Create Profile | ✅ | ✅ | ✅ | ✅ |
| → Edit Profile | ✅ | ✅ | ✅ | ✅ |
| → View Profile | ✅ | ✅ | ✅ | ✅ |
| → Profile Picture Upload | ✅ | ✅ | ✅ | ✅ |
| **Coach Profile** | ✅ | ✅ | ✅ | Complete |
| → Edit Profile | ✅ | ✅ | ✅ | ✅ |
| → View Profile | ✅ | ✅ | ✅ | ✅ |
| → Profile Picture Upload | ✅ | ✅ | ✅ | ✅ |
| **Athlete Discovery (Coaches)** | ✅ | ✅ | ✅ | Complete |
| → List Athletes | ✅ | ✅ | ✅ | ✅ |
| → Search Athletes | ✅ | ❌ | ❌ | Frontend only |
| → Filter Athletes | ✅ | ❌ | ❌ | Frontend only |
| **Coach Discovery (Athletes)** | ✅ | ✅ | ✅ | Complete |
| → Find Coaches by Sport | ✅ | ✅ | ✅ | ✅ |
| → Search Coaches | ✅ | ❌ | ❌ | Frontend only |
| **Connections** | ✅ | ✅ | ✅ | Complete |
| → Send Request | ✅ | ✅ | ✅ | ✅ |
| → Check Status | ✅ | ✅ | ✅ | ✅ |
| → Accept/Reject | ✅ | ✅ | ✅ | ✅ |
| → View Connected | ✅ | ✅ | ✅ | ✅ |
| → Disconnect | ✅ | ✅ | ✅ | ✅ |
| **Messaging** | ✅ | ✅ | ✅ | Complete |
| → Create Conversation | ✅ | ✅ | ✅ | ✅ |
| → Send Message | ✅ | ✅ | ✅ | ✅ |
| → View Messages | ✅ | ✅ | ✅ | ✅ |
| → Mark Read | ✅ | ✅ | ✅ | ✅ |
| **Showcase** | ✅ | ✅ | ✅ | Complete |
| → Create Post | ✅ | ✅ | ✅ | ✅ |
| → Upload Media | ✅ | ✅ | ✅ | ✅ |
| → Edit Post | ✅ | ✅ | ✅ | ✅ |
| → Delete Post | ✅ | ✅ | ✅ | ✅ |
| → View Public Showcase | ✅ | ✅ | ✅ | ✅ |
| **Opportunities** | ⚠️ | ❌ | ❌ | Planned |
| **Notifications** | ⚠️ | ✅ | ✅ | Partial |
| → Settings Stored | ✅ | ✅ | ✅ | ✅ |
| → Notifications Sent | ❌ | ❌ | ❌ | Not implemented |

---

## 18. Potential Cleanup & Improvements

### 18.1 Code Organization

**Potential Improvements:**
- Extract common API calls into utility functions
- Create reusable form components
- Consolidate duplicate CSS
- Create custom hooks for common patterns (useAuth, useProfile, etc.)

---

### 18.2 Unused Code

**Potentially Unused:**
- `CoachAthlete` model and routes (Connection model seems to be primary)
- `Sport` model (no UI for sport selection)
- Email sending modules (Nodemailer, Resend configured but not used)
- Cloudinary (ImageKit used instead)
- `@react-pdf/renderer` (no PDF export feature)
- `ogl` (3D graphics library, not used)
- `.vscode/` folder in repository

---

### 18.3 Duplicate Files

**Note:** Need to verify if these are intentional:
- `AthleteResume.jsx` (appears twice in structure)
- Multiple route files with similar patterns

---

### 18.4 Frontend Improvements

1. **Add Error Boundaries** for better error handling
2. **Implement Loading Skeletons** for better UX
3. **Add Form Validation** on client-side
4. **Extract API URLs** to config file
5. **Implement Protected Routes** wrapper
6. **Add Token Refresh** logic
7. **Create Custom Hooks** for common patterns

---

### 18.5 Backend Improvements

1. **Add Request Logging** middleware
2. **Implement Pagination** for large datasets
3. **Add Backend Search/Filter** instead of client-side
4. **Implement Caching** for frequently accessed data
5. **Add API Documentation** (Swagger/OpenAPI)
6. **Implement WebSocket** for real-time chat
7. **Add Transaction Support** for complex operations
8. **Add Database Indexes** for performance

---

## 19. Developer Guide

### Quick Start for New Developers

#### 1. Understanding the Project

**Read These First:**
- Project structure tree (Section 3)
- Database relationships (Section 4.9)
- Backend architecture (Section 5)
- Frontend architecture (Section 6)

#### 2. Local Setup

**Clone and Install:**
```bash
git clone <repo>
cd Athlyx
npm install
cd backend && npm install && cd ../frontend && npm install && cd ..
```

**Environment Setup:**
- Create `backend/.env` with MONGO_URI, JWT_SECRET, ImageKit credentials
- Note: Frontend API URL hardcoded (should be .env)

**Start Development:**
```bash
npm run dev
```
- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:5173

#### 3. Key Files to Know

| Task | File |
|------|------|
| Add new route | `backend/src/routes/*.route.js` |
| Add new controller | `backend/src/controllers/*.controller.js` |
| Add new model | `backend/src/models/*.model.js` |
| Add new page | `frontend/src/pages/` |
| Add new component | `frontend/src/components/` |
| API calls | `frontend/src/services/auth.service.js` (expand this) |
| Navigation | `frontend/src/App.jsx` |

#### 4. Common Tasks

**Add New Feature:**

1. **Create Database Model** (`backend/src/models/`)
2. **Create Controller** (`backend/src/controllers/`)
3. **Create Routes** (`backend/src/routes/`)
4. **Create Frontend Pages** (`frontend/src/pages/`)
5. **Add Navigation** (`frontend/src/App.jsx`)
6. **Create Service** if API heavy (`frontend/src/services/`)

**Example: Add "Opportunities" Feature:**

Backend:
1. Create `opportunity.model.js` (schema)
2. Create `opportunity.route.js` (POST, GET, PUT, DELETE)
3. Create `opportunity.controller.js` (CRUD logic)
4. Mount routes in `app.js`

Frontend:
1. Create `pages/Athlete-Pages/Opportunities.jsx` (or expand placeholder)
2. Create `pages/Coach-Pages/Opportunities.jsx`
3. Add routes in `App.jsx`
4. Add sidebar navigation items
5. Create API service functions

**Add Authentication to Route:**

Backend:
```javascript
router.post(
    "/route",
    authMiddleware,  // Add this
    controller.function
);
```

Frontend:
```javascript
const token = localStorage.getItem("token");
axios.get(url, {
    headers: {
        Authorization: `Bearer ${token}`  // Add this
    }
});
```

#### 5. Frontend Data Flow Pattern

```javascript
// 1. Component mounts
useEffect(() => {
    // 2. Get token
    const token = localStorage.getItem("token");
    
    // 3. Make API call
    axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        // 4. Update state
        setData(response.data);
    })
    .catch(error => {
        // 5. Handle error
        setError(error.message);
        if (error.status === 401) {
            // Redirect to auth
            navigate("/auth");
        }
    });
}, []);
```

#### 6. Backend Controller Pattern

```javascript
async function controllerFunction(req, res) {
    try {
        // 1. Get data from request
        const { field1, field2 } = req.body;
        const userId = req.user.id;  // From auth middleware
        
        // 2. Validate
        if (!field1) {
            return res.status(400).json({
                message: "Field1 is required"
            });
        }
        
        // 3. Database operation
        const result = await Model.create({ ... });
        
        // 4. Return response
        return res.status(201).json({
            success: true,
            message: "Success message",
            data: result
        });
        
    } catch (error) {
        // 5. Error handling
        return res.status(500).json({
            success: false,
            message: "Error message",
            error: error.message
        });
    }
}
```

#### 7. Testing API Endpoints

**Use Postman or similar:**

1. **Auth Required Routes:**
   - Add header: `Authorization: Bearer <token_from_login>`

2. **File Upload Routes:**
   - Set Content-Type: multipart/form-data
   - Add file in form field

3. **Test Flow:**
   - Register → Get user
   - Login → Get token
   - Use token for protected routes
   - Test with valid and invalid data

#### 8. Database Queries

**Common Patterns:**

```javascript
// Find one
const user = await User.findById(userId);
const user = await User.findOne({ email });

// Find multiple
const athletes = await Athlete.find({ sport: "Cricket" });

// Populate references
const athlete = await Athlete.findById(id)
    .populate("user", "name email profilePic");

// Update
await User.findByIdAndUpdate(userId, { name: "New Name" });

// Delete
await Athlete.findByIdAndDelete(athleteId);

// Count
const count = await Message.countDocuments({ 
    conversation: convId, 
    read: false 
});
```

#### 9. Debugging Tips

- **Backend:** Check server.js console for logs
- **Frontend:** Check browser console for errors
- **Network:** Use browser DevTools Network tab to inspect API calls
- **Logs:** Controllers have console.error() statements
- **Middleware:** Auth errors show 401 status

#### 10. Performance Considerations

- Avoid N+1 queries → Use `.populate()`
- Implement pagination for large datasets
- Cache frequently accessed data
- Use database indexes
- Minimize API calls from frontend

---

## Appendix: Architecture Diagram

```
                         ┌─────────────────────────────────────────┐
                         │          ATHLYX ARCHITECTURE            │
                         └─────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │       FRONTEND (React + Vite)       │
                    │  http://localhost:5173              │
                    └─────────────────────────────────────┘
                                    │
                        ┌───────────┼───────────┐
                        │           │           │
                     Pages      Components   Services
                    ┌─────┐     ┌────────┐  ┌────────┐
                    │Auth │     │Navbar  │  │Auth    │
                    │Dash │     │Sidebar │  │Service │
                    │Prof │     │Messages│  └────────┘
                    │Disc │     └────────┘
                    └─────┘
                        │
                        │ Axios HTTP Calls
                        │ Authorization: Bearer <JWT>
                        │
                    ┌─────────────────────────────────────┐
                    │    BACKEND (Express.js)             │
                    │    http://localhost:5000/api        │
                    └─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌──────────┐   ┌─────────┐   ┌─────────┐
    │ Routes   │   │Middleware│  │Database │
    ├──────────┤   ├─────────┤  ├─────────┤
    │/auth     │   │Auth     │  │MongoDB  │
    │/athletes │   │Upload   │  │Mongoose │
    │/coaches  │   │Showcase │  └─────────┘
    │/showcase │   └─────────┘
    │/chat     │
    │/conn     │       Controllers
    └──────────┘   ┌─────────────────┐
                   │auth.controller  │
                   │athlete.ctrl     │
                   │coach.ctrl       │
                   │showcase.ctrl    │
                   │chat.ctrl        │
                   │connection.ctrl  │
                   └─────────────────┘
                        │
                    ┌───┴───┐
                    │       │
              ┌─────────┐ ┌───────────┐
              │ImageKit │ │MongoDB    │
              │(Files)  │ │(Data)     │
              └─────────┘ └───────────┘
```

---

## End of Documentation

**Last Updated:** 2026-08-29  
**Documentation Version:** 1.0  
**Status:** Complete

This documentation describes the Athlyx project as it exists at the time of writing. For the most up-to-date information, always refer to the actual source code.

