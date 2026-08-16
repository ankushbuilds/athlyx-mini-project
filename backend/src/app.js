const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const athleteRoutes = require("./routes/athlete.route");



const app = express();
app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);

module.exports = app;