require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const requireAuth = require("./middleware/auth");
const seedDefaults = require("./seed");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const leaveRoutes = require("./routes/leaves");
const announcementRoutes = require("./routes/announcements");
const dashboardRoutes = require("./routes/dashboard");

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/employees", requireAuth, employeeRoutes);
app.use("/api/leaves", requireAuth, leaveRoutes);
app.use("/api/announcements", requireAuth, announcementRoutes);

// Unknown API route
app.use("/api", (req, res) => {
    res.status(404).json({ message: "API route not found." });
});

// Central error handler: turns Mongoose errors into clean messages
app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message).join(", ");
        return res.status(400).json({ message });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: "An employee with this email already exists." });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID." });
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB();
    await seedDefaults();

    app.listen(PORT, () => {
        console.log(`HR Portal running at http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    start().catch((error) => {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    });
}

module.exports = app;
