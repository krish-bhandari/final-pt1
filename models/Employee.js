const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must contain at least 3 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
        },
        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true
        },
        position: {
            type: String,
            required: [true, "Position is required"],
            trim: true,
            minlength: [2, "Please enter a valid position"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
