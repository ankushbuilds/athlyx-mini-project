# ATHLYX - Quick Reference Guide

**Quick cheat sheet for Athlyx developers.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Folder Structure](#folder-structure)
4. [API Endpoints](#api-endpoints)
5. [Database Models](#database-models)
6. [Frontend Routes](#frontend-routes)
7. [Common Tasks](#common-tasks)
8. [Environment Variables](#environment-variables)
9. [Development Commands](#development-commands)

---

## Project Overview

**Athlyx** = Professional networking platform connecting **athletes** with **coaches**

**Tech Stack:**
- **Frontend:** React + Vite + Axios + React Router
- **Backend:** Express.js + MongoDB + Mongoose
- **Authentication:** JWT (7-day expiration)
- **File Storage:** ImageKit
- **Password Hashing:** bcrypt

**Key Features:**
- User registration & login (athlete/coach)
- Profile management (both roles)
- Coach discovery (athletes) & athlete discovery (coaches)
- Connection request system
- Messaging/chat (accepted connections only)
- Showcase media posts

---

## Getting Started

### Setup
```bash
# Install dependencies
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# Configure environment
# Create backend/.env with:
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
PORT=5000
```

### Start Development
```bash
npm run dev
# Runs frontend (http://localhost:5173) & backend (http://localhost:5000) concurrently
```

### Frontend Only
```bash
cd frontend && npm run dev
```

### Backend Only
```bash
cd backend && npm run dev
```

---

## Folder Structure

```
Athlyx/
├── frontend/src/
│   ├── components/          Navbar, Sidebars, Messages, Buttons
│   ├── pages/              Auth, Landing, Home, + role-based pages
│   │   ├── Athlete-Pages/  AthleteDashboard, AthleteProfile, Discover, etc.
│   │   └── Coach-Pages/    CoachDashboard, CoachProfile, CoachDiscover, etc.
│   └── services/            auth.service.js (API calls)
│
└── backend/src/
    ├── config/              Database & ImageKit configuration
    ├── middleware/          Auth, file upload middleware
    ├── models/              Mongoose schemas (User, Athlete, Connection, etc.)
    ├── controllers/         Business logic for each feature
    └── routes/              Express route definitions
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register              Register user
POST   /api/auth/login                 Login user
GET    /api/auth/me                    Get current user (protected)
PUT    /api/auth/change-password       Change password (protected)
PUT    /api/auth/settings              Update settings (protected)
DELETE /api/auth/delete-account        Delete account (protected)
```

### Athletes
```
POST   /api/athletes/create            Create athlete profile (protected)
GET    /api/athletes/get-profile       Get own athlete profile (protected)
PUT    /api/athletes/update-profile    Update own profile (protected)
GET    /api/athletes/get-all           Get all athletes
GET    /api/athletes/:id               Get specific athlete
```

### Coaches
```
GET    /api/coaches/get-profile        Get own coach profile (protected)
PUT    /api/coaches/update-profile     Update own profile (protected)
```

### Users
```
POST   /api/users/profile-pic          Upload profile picture (protected, multipart)
GET    /api/users/coaches              Get coaches by athlete's sport (protected)
GET    /api/users/coaches/:coachId     Get specific coach (protected)
```

### Connections
```
POST   /api/connections/send/:athleteId                Send request (protected)
GET    /api/connections/status/:athleteId              Check status (protected)
GET    /api/connections/athlete/requests               Get athlete's requests (protected)
PUT    /api/connections/athlete/respond/:connectionId  Respond to request (protected)
GET    /api/connections/coach/athletes                 Get connected athletes (protected)
GET    /api/connections/athlete/coaches                Get connected coaches (protected)
DELETE /api/connections/disconnect/:connectionId       Disconnect (protected)
```

### Showcase
```
POST   /api/showcase/create            Create post (protected, multipart, max 10 files)
GET    /api/showcase/my-posts          Get own posts (protected)
GET    /api/showcase/athlete/:athleteId Get public posts (protected)
PUT    /api/showcase/update/:id        Update post (protected)
DELETE /api/showcase/delete/:id        Delete post (protected)
```

### Chat
```
POST   /api/chat/conversation/:userId           Create/get conversation (protected)
GET    /api/chat/conversations                  Get all conversations (protected)
GET    /api/chat/:conversationId/messages       Get messages (protected)
POST   /api/chat/:conversationId/message        Send message (protected)
PUT    /api/chat/:conversationId/read           Mark as read (protected)
```

### Headers Required
```
Authorization: Bearer <jwt_token>
Content-Type: application/json (or multipart/form-data for file uploads)
```

---

## Database Models

### User
```
{
  name, email, password (hashed), role (athlete/coach/scout/academy/admin),
  profilePic, phone, address, sport, specialization, experience,
  organization, achievements[], skills[], bio, isAvailable,
  settings, emailVerified, createdAt, updatedAt
}
```

### Athlete
```
{
  user (ref to User), dateOfBirth, gender, phone, address,
  sport (required), position, experience, achievements[],
  skills[], bio, height, weight, socialLinks,
  verificationStatus, isAvailable, settings,
  createdAt, updatedAt
}
```

### Connection
```
{
  coach (ref to User), athlete (ref to User),
  status (pending/accepted/rejected/cancelled),
  createdAt, updatedAt
}
```

### Showcase
```
{
  athlete (ref to Athlete), caption, media[],
  media[].url, media[].type (image/video), media[].fileId,
  visibility (public/private),
  createdAt, updatedAt
}
```

### Conversation
```
{
  participants[] (2 User refs), participantKey (unique, sorted),
  lastMessage (ref to Message), lastMessageAt,
  createdAt, updatedAt
}
```

### Message
```
{
  conversation (ref to Conversation), sender (ref to User),
  receiver (ref to User), text, read,
  createdAt, updatedAt
}
```

---

## Frontend Routes

### Public
```
/                    Landing page
/home                Home page
/auth                Login/Register
/about, /contact     Info pages
/help, /discover     Help & public discovery
```

### Athlete (role=athlete)
```
/athlete/dashboard              Dashboard
/athlete/profile                Edit profile
/athlete/my-profile             View own profile
/athlete/discover               Find coaches (by sport)
/athlete/opportunities          Opportunities (placeholder)
/athlete/showcase               Media showcase
/athlete/connections            Connected coaches
/athlete/messages               Chat
/athlete/settings               Settings
```

### Coach (role=coach)
```
/coach/dashboard               Dashboard
/coach/profile                 Edit profile
/coach/my-profile              View own profile
/coach/athletes                Connected athletes
/coach/discover                Find athletes
/coach/requests                Connection requests
/coach/messages                Chat
/coach/settings                Settings
```

### Shared
```
/profile/athlete/:athleteId    View any athlete
/profile/coach/:coachId        View any coach
/coach/athletes/:athleteId     Coach viewing athlete
```

---

## Common Tasks

### Add New API Endpoint

**Backend:**
1. Create route in `routes/feature.route.js`
2. Create controller function in `controllers/feature.controller.js`
3. Mount in `src/app.js`: `app.use("/api/feature", featureRoutes)`

**Frontend:**
1. Create/update service in `services/feature.service.js`
2. Use in component: 
```javascript
import { featureAPI } from "../services/feature.service.js";
const response = await featureAPI.getData();
```

### Handle Protected Routes

**Backend:**
```javascript
router.get("/endpoint", authMiddleware, controller.function);
```

**Frontend:**
```javascript
const token = localStorage.getItem("token");
axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
});
```

### File Upload

**Backend Middleware:**
```javascript
// For profile pictures: upload.single("profilePic")
// For showcase: showcaseUpload.array("media", 10)
```

**Frontend:**
```javascript
const formData = new FormData();
formData.append("profilePic", fileInput.files[0]);
formData.append("caption", "text");

axios.post(url, formData, {
    headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }
});
```

### Check Authentication Status

**Frontend:**
```javascript
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
    navigate("/auth");
}
```

### Validate User Role

**Frontend:**
```javascript
const user = JSON.parse(localStorage.getItem("user"));
if (user.role !== "coach") {
    navigate("/auth");
}
```

**Backend:**
```javascript
if (req.user.role !== "coach") {
    return res.status(403).json({ message: "Coach only" });
}
```

---

## Environment Variables

### Backend (.env required)

| Variable | Purpose | Example |
|----------|---------|---------|
| MONGO_URI | MongoDB connection | `mongodb://localhost:27017/athlyx` |
| JWT_SECRET | JWT signing key | Any secure string |
| IMAGEKIT_PUBLIC_KEY | ImageKit auth | Public key from dashboard |
| IMAGEKIT_PRIVATE_KEY | ImageKit auth | Private key from dashboard |
| IMAGEKIT_URL_ENDPOINT | ImageKit CDN | `https://ik.imagekit.io/accountname/` |
| PORT | Server port | `5000` (default) |

### Frontend (Hardcoded - should be .env)

```javascript
// Currently hardcoded in files
const API_BASE_URL = "http://localhost:5000/api/";
```

---

## Development Commands

### Root Directory
```bash
npm install                # Install all dependencies
npm run dev                # Start frontend + backend concurrently
npm run build              # Build frontend
```

### Backend
```bash
cd backend
npm install                # Install backend dependencies
npm run dev                # Start with nodemon (auto-reload)
npm start                  # Start production server
```

### Frontend
```bash
cd frontend
npm install                # Install frontend dependencies
npm run dev                # Start Vite dev server (http://localhost:5173)
npm run build              # Build for production
npm run lint               # Run ESLint
npm run preview            # Preview production build
```

---

## Authentication Flow Summary

### Register
```
POST /auth/register {name, email, password, role}
  → Validate email unique
  → Hash password (bcrypt, 10 rounds)
  → Create User
  → Return user object
```

### Login
```
POST /auth/login {email, password}
  → Find user
  → Verify password (bcrypt)
  → Generate JWT (7d expiration)
  → Return {token, user}
  → Frontend saves to localStorage
```

### Protected Request
```
GET /protected/endpoint
  Header: Authorization: Bearer <token>
  → Backend verifies JWT
  → Extracts user ID and role
  → Attaches to req.user
  → Processes request
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Add `Authorization: Bearer <token>` header |
| 403 Forbidden | Wrong role/permissions | Verify user role matches endpoint requirements |
| 404 Not Found | Resource doesn't exist | Check ID is correct and resource exists in DB |
| 400 Bad Request | Invalid input | Validate request body matches API spec |
| Multer file error | Wrong file type/size | Check `upload.middleware.js` for allowed types |
| ImageKit error | Auth keys invalid | Verify IMAGEKIT keys in .env |
| MongoDB error | Connection failed | Check MONGO_URI in .env |
| CORS error | Frontend/backend mismatch | Ensure frontend URL in CORS whitelist (if configured) |

---

## Testing Endpoints (Postman/curl)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Athlete",
    "email": "john@example.com",
    "password": "password123",
    "role": "athlete"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token_from_login>"
```

---

## Key Concepts

**Roles:**
- **Athlete:** Can discover coaches, create profile, showcase media
- **Coach:** Can discover athletes, manage connections, view athlete profiles

**Connections:**
- Coach sends request to athlete
- Athlete accepts/rejects
- Once accepted → can message & see details

**Messaging:**
- Only between accepted connections
- Coach ↔ Athlete only (no athlete-to-athlete or coach-to-coach)
- Messages tracked with read status

**Showcase:**
- Public posts visible to all
- Private posts hidden
- Multiple media (images/videos) per post

---

## Performance Tips

- ✅ Use `.populate()` for related data (avoid N+1 queries)
- ✅ Implement pagination for large datasets
- ✅ Cache frequently accessed data
- ✅ Use database indexes for common queries
- ✅ Minimize API calls from frontend
- ✅ Lazy load images/videos

---

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens verified on protected routes
- ✅ CORS enabled (should be restricted)
- ✅ Helmet security headers
- ✅ Input validation on backend
- ⚠️ No rate limiting
- ⚠️ No email verification (scaffolding exists)
- ⚠️ No account lockout after failed attempts
- ⚠️ Token in localStorage (XSS vulnerable)

---

## File Upload Specs

### Profile Picture
- **Endpoint:** `POST /api/users/profile-pic`
- **Form Field:** `profilePic`
- **Allowed:** JPG, JPEG, PNG, WEBP
- **Max Size:** 5MB
- **Storage:** ImageKit (`/athlyx/profile-pics`)

### Showcase Media
- **Endpoint:** `POST /api/showcase/create`
- **Form Field:** `media`
- **Allowed Images:** JPG, JPEG, PNG, WEBP
- **Allowed Videos:** MP4, WEBM, MOV
- **Max Files:** 10
- **Max Size:** 50MB per file
- **Storage:** ImageKit (`/athlyx/showcase`)

---

## Useful Commands

```bash
# Frontend only
npm run dev --prefix frontend

# Backend only
npm run dev --prefix backend

# Build frontend
npm run build --prefix frontend

# Lint frontend
npm run lint --prefix frontend

# MongoDB connection test (if using local)
mongo --version
```

---

## Debugging

**Backend:**
- Check `console.error()` in server terminal
- Add `console.log()` in controller functions
- Use `req.user` to verify auth middleware works

**Frontend:**
- Check browser console for errors
- Use React DevTools extension
- Check Network tab for API calls and responses
- Verify token exists: `localStorage.getItem("token")`

---

## Next Steps for Development

1. ✅ Authentication works
2. ✅ Profiles (athlete/coach) complete
3. ✅ Connections system complete
4. ✅ Messaging system complete
5. ✅ Showcase system complete
6. ⚠️ **Implement:** Opportunities feature
7. ⚠️ **Improve:** Email notifications
8. ⚠️ **Improve:** Real-time chat (WebSocket)
9. ⚠️ **Improve:** Search/filtering (backend)
10. ⚠️ **Security:** Implement refresh tokens, rate limiting

---

## Additional Resources

- **Main Documentation:** See `ATHLYX_DOCUMENTATION.md` for complete details
- **MongoDB Docs:** https://docs.mongodb.com/manual/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **ImageKit Docs:** https://docs.imagekit.io/
- **JWT Docs:** https://jwt.io/

---

**Last Updated:** 2026-08-29  
**Quick Reference Version:** 1.0

