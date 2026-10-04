const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

// Escape user input before using it inside a regular expression
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/employees?search=text
router.get("/", async (req, res, next) => {
    try {
        const filter = {};
        const search = String(req.query.search || "").trim();

        if (search) {
            const pattern = new RegExp(escapeRegex(search), "i");

            filter.$or = [
                { name: pattern },
                { email: pattern },
                { department: pattern },
                { position: pattern }
            ];
        }

        const employees = await Employee.find(filter).sort({ createdAt: 1 });
        res.json(employees);
    } catch (error) {
        next(error);
    }
});

// POST /api/employees
router.post("/", async (req, res, next) => {
    try {
        const { name, email, department, position } = req.body;
        const employee = await Employee.create({ name, email, department, position });
        res.status(201).json(employee);
    } catch (error) {
        next(error);
    }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res, next) => {
    try {
        const { name, email, department, position } = req.body;

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, department, position },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.json(employee);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.json({ message: "Employee deleted." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
