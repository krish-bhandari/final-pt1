const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Announcement title must contain at least 3 characters"]
        },
        date: {
            type: String, // YYYY-MM-DD
            required: [true, "Date is required"]
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Announcement message is too short"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
