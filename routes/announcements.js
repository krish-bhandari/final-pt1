const express = require("express");
const Announcement = require("../models/Announcement");

const router = express.Router();

// GET /api/announcements  (newest first)
router.get("/", async (req, res, next) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        next(error);
    }
});

// POST /api/announcements
router.post("/", async (req, res, next) => {
    try {
        const { title, date, message } = req.body;
        const announcement = await Announcement.create({ title, date, message });
        res.status(201).json(announcement);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/announcements/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found." });
        }

        res.json({ message: "Announcement deleted." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
