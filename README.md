# HR Management Portal

A full-stack Human Resource Management Portal built with **Node.js, Express and MongoDB**, with a frontend written in plain HTML, CSS and JavaScript.

## Project Overview

The portal lets an HR admin manage employee records, leave requests and company announcements. Version 1 stored everything in the browser's LocalStorage. Version 2 adds a real backend: data now lives in a MongoDB database and the frontend talks to it through a REST API secured with JWT authentication.

## Features

* Secure admin login (hashed password, JWT token)
* Dashboard with live statistics
* Employee management: add, edit, delete, search
* Leave management: apply, approve, reject, delete, filter by status
* Company announcements: create and delete
* Server-side validation with clear error messages
* Duplicate employee email protection (unique index)
* Protected API: every data route requires a valid token
* Responsive user interface

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (Fetch API) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose (ODM) |
| Authentication | JSON Web Tokens (jsonwebtoken), password hashing (bcryptjs) |
| Configuration | dotenv, CORS |
| Tools | Visual Studio Code, Git and GitHub |

## Architecture

```text
Browser (HTML/CSS/JS)
        |  fetch() + JWT in Authorization header
        v
Express server (server.js)
        |  middleware: JSON parser, CORS, auth check
        v
Routes  ->  Mongoose Models  ->  MongoDB
```

## Project Structure

```text
HR-Management-Portal/
│
├── server.js              # Express app entry point
├── seed.js                # Creates demo admin + sample employees
├── package.json
├── .env.example           # Copy to .env
│
├── config/
│   └── db.js              # MongoDB connection
│
├── models/                # Mongoose schemas
│   ├── Admin.js
│   ├── Employee.js
│   ├── Leave.js
│   └── Announcement.js
│
├── routes/                # REST API endpoints
│   ├── auth.js
│   ├── employees.js
│   ├── leaves.js
│   ├── announcements.js
│   └── dashboard.js
│
├── middleware/
│   └── auth.js            # JWT verification
│
└── public/                # Frontend served by Express
    ├── index.html
    ├── dashboard.html
    ├── employees.html
    ├── leaves.html
    ├── announcements.html
    ├── css/style.css
    └── js/
        ├── api.js         # fetch wrapper, token handling, HTML escaping
        ├── login.js
        ├── dashboard.js
        ├── employees.js
        ├── leaves.js
        └── announcements.js
```

## How to Run

**Prerequisites:** Node.js 18+ and MongoDB (local install or a free MongoDB Atlas cluster).

1. Clone the project and open the folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`: set `MONGODB_URI` (local default is `mongodb://127.0.0.1:27017/hr_portal`, or paste your Atlas connection string) and set `JWT_SECRET` to any long random string.
4. Start the server:
   ```bash
   npm start
   ```
   On first start the demo admin and three sample employees are created automatically.
5. Open <http://localhost:3000> in your browser.

For auto-restart while developing, use `npm run dev`.

## Demo Login

```text
Username: admin
Password: admin123
```

## API Reference

All routes except login require the header `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/dashboard` | Statistics and recent activity |
| GET | `/api/employees?search=` | List / search employees |
| POST | `/api/employees` | Add employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/leaves?status=` | List leave requests, optional status filter |
| POST | `/api/leaves` | Submit leave request (starts as Pending) |
| PATCH | `/api/leaves/:id/status` | Approve or reject (`{ "status": "Approved" }`) |
| DELETE | `/api/leaves/:id` | Delete leave request |
| GET | `/api/announcements` | List announcements, newest first |
| POST | `/api/announcements` | Create announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |

## Security Notes

* Admin password is stored as a bcrypt hash, never in plain text.
* Data routes are protected by JWT middleware.
* User-entered text is escaped before being shown in the page (prevents HTML injection).
* Search input is escaped before use in a MongoDB regular expression.
* Change the demo password and `JWT_SECRET` before any real deployment.

## Future Improvements

* Multiple users with role-based access control (admin, HR, employee)
* Link leave requests to employee records instead of free-text names
* Attendance and payroll modules
* Email notifications
* Pagination for large employee lists
* Deployment (Render / Railway with MongoDB Atlas)

## Author

Krish Bhandari

B.Tech Computer Science and Engineering
