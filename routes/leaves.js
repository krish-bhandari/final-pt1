const express = require("express");
const Leave = require("../models/Leave");

const router = express.Router();

// GET /api/leaves?status=Pending|Approved|Rejected
router.get("/", async (req, res, next) => {
    try {
        const filter = {};
        const { status } = req.query;

        if (status && status !== "All") {
            filter.status = status;
        }

        const leaves = await Leave.find(filter).sort({ createdAt: 1 });
        res.json(leaves);
    } catch (error) {
        next(error);
    }
});

// POST /api/leaves  (status always starts as Pending)
router.post("/", async (req, res, next) => {
    try {
        const { employee, type, startDate, endDate, reason } = req.body;

        const leave = await Leave.create({
            employee,
            type,
            startDate,
            endDate,
            reason,
            status: "Pending"
        });

        res.status(201).json(leave);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/leaves/:id/status   body: { status: "Approved" | "Rejected" }
router.patch("/:id/status", async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be Approved or Rejected." });
        }

        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        res.json(leave);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/leaves/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const leave = await Leave.findByIdAndDelete(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        res.json({ message: "Leave request deleted." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
