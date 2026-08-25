const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const athleteRoutes = require("./routes/athlete.route");
const userRoutes = require("./routes/user.route");
const showcaseRoutes = require("./routes/showcase.route");
const coachRoutes = require("./routes/coach.route");
const coachAthleteRoutes = require("./routes/coachAthlete.route");
const connectionRoutes = require("./routes/connection.route");




const app = express();
app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/coach-athletes",coachAthleteRoutes);
app.use("/api/connections", connectionRoutes);

module.exports = app;