require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Employee = require("./models/Employee");

// Creates the demo admin and sample employees only if they don't exist yet
async function seedDefaults() {
    const adminExists = await Admin.findOne({ username: "admin" });

    if (!adminExists) {
        await Admin.create({ username: "admin", password: "admin123" });
        console.log("Seeded demo admin (admin / admin123)");
    }

    if ((await Employee.countDocuments()) === 0) {
        await Employee.insertMany([
            { name: "Rahul Sharma", email: "rahul@example.com", department: "IT", position: "Software Developer" },
            { name: "Priya Singh", email: "priya@example.com", department: "HR", position: "HR Executive" },
            { name: "Aman Verma", email: "aman@example.com", department: "Finance", position: "Accountant" }
        ]);
        console.log("Seeded sample employees");
    }
}

module.exports = seedDefaults;

// `npm run seed` runs this file directly
if (require.main === module) {
    const connectDB = require("./config/db");

    connectDB()
        .then(seedDefaults)
        .then(() => mongoose.disconnect())
        .catch((error) => {
            console.error(error.message);
            process.exit(1);
        });
}
