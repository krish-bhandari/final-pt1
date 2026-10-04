const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        employee: {
            type: String,
            required: [true, "Employee name is required"],
            trim: true
        },
        type: {
            type: String,
            required: [true, "Leave type is required"],
            trim: true
        },
        startDate: {
            type: String, // stored as YYYY-MM-DD, same as the date input
            required: [true, "Start date is required"]
        },
        endDate: {
            type: String,
            required: [true, "End date is required"],
            validate: {
                validator: function (value) {
                    return value >= this.startDate;
                },
                message: "End date cannot be before start date"
            }
        },
        reason: {
            type: String,
            required: [true, "Reason is required"],
            trim: true,
            minlength: [5, "Please provide a more detailed reason"]
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
