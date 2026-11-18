
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const athleteRoutes = require("./routes/athlete.route");
const userRoutes = require("./routes/user.route");
const showcaseRoutes = require("./routes/showcase.route");
const coachRoutes = require("./routes/coach.route");
const coachAthleteRoutes = require("./routes/coachAthlete.route");
const connectionRoutes = require("./routes/connection.route");
const chatRoutes = require("./routes/chat.route");
const challengeRoutes = require("./routes/challenge.route");
const academyRoutes = require("./routes/academy.route");
const opportunityRoutes = require("./routes/opportunity.route");
const scoutRoutes = require("./routes/scout.route");
const shortlistRoutes = require("./routes/shortlist.route");

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://athlyx-mini-project.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/coach-athletes", coachAthleteRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/academies", academyRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/scouts", scoutRoutes);
app.use("/api/shortlist", shortlistRoutes);

module.exports = app;
