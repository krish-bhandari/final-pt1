const express = require("express");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Announcement = require("../models/Announcement");

const router = express.Router();

// GET /api/dashboard  - all dashboard numbers in one request
router.get("/", async (req, res, next) => {
    try {
        const [
            totalEmployees,
            departments,
            pendingLeaves,
            approvedLeaves,
            recentLeaves,
            recentAnnouncements
        ] = await Promise.all([
            Employee.countDocuments(),
            Employee.distinct("department"),
            Leave.countDocuments({ status: "Pending" }),
            Leave.countDocuments({ status: "Approved" }),
            Leave.find().sort({ createdAt: -1 }).limit(5),
            Announcement.find().sort({ createdAt: -1 }).limit(3)
        ]);

        res.json({
            totalEmployees,
            totalDepartments: departments.length,
            pendingLeaves,
            approvedLeaves,
            recentLeaves,
            recentAnnouncements
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
