# HRCore — HR Management System

A modern, full-featured HR management system built with React and Tailwind CSS. Supports two distinct roles — **Admin** and **Employee** — each with their own dashboard, navigation, and feature set. Fully responsive across desktop and mobile.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat&logo=reactrouter)

---

## Demo Credentials

| Role     | Email          | Password  |
|----------|----------------|-----------|
| Admin    | admin@hr.com   | admin123  |
| Employee | shumaim@hr.com    | shumaim123   |

---

## Features

### 🔐 Authentication
- Login and Register with role-based redirect on sign-in
- Admin lands on the Admin Dashboard; Employee lands on the Employee Dashboard
- Protected routes with an `adminOnly` guard
- Persistent session via React Context

---

### 👔 Admin Features

#### 📊 Dashboard
- Stat cards: Total Employees, On Leave, Departments, Total Payroll
- Monthly hiring bar chart (pure SVG, no library)
- Leave distribution donut chart
- Recent leave requests feed

#### 🏢 Department Management
- Add, edit, and delete departments
- Live employee count per department pulled from employee records
- Search by department name
- Summary stats: total departments, total headcount, average team size

#### 👥 Employee Management
- Full CRUD — add, edit, delete employees
- Search by name, position, or email
- Filter by department
- Click any row to open a detailed employee profile modal
- Status badges: Active, On Leave, Inactive

#### 🌴 Leave Management
- View all leave requests across the company
- Approve or reject with one click (inline or via detail modal)
- Filter by status and leave type
- Apply leave on behalf of any employee

#### 💰 Salary Records
- Add and edit salary records per employee per month
- Live auto-calculation: Base + Bonus − Deductions = Net Pay
- Filter by month, search by employee name
- Monthly payroll summary cards
- Prevents duplicate records for the same employee and month

#### 📅 Attendance Overview
- Daily attendance view: present, absent, or unmarked per employee
- Filter by department and date (last 14 days)
- 14-day heatmap grid across all employees
- Stats for selected date: present, absent, unmarked counts

#### 📰 News & Announcements
- Publish, edit, and delete news posts
- Category tags: Announcement, Policy, Event, Achievement, Reminder
- Filter posts by category

---

### 👤 Employee Features

#### 🏠 Employee Dashboard
- Personalised greeting with time of day
- Stat cards: present days this month, today's attendance status, pending leave, latest net pay
- Attendance widget with inline Mark Present button and 14-day visual strip
- Leave widget showing recent requests with status badges and quick apply link
- Latest 3 news posts preview
- Profile snapshot with personal info
- Latest payslip breakdown
- Team widget showing department colleagues

#### 👤 My Profile
- View personal info: name, position, department, status, join date, email, phone
- Years at company auto-calculated from join date
- Base salary display (read-only)

#### 🌴 My Leave
- Apply for leave with type selector, date range picker, and auto day count
- Personal leave history with status filter (all / pending / approved / rejected)
- Stats: total requests, pending, approved, days taken

#### 💰 My Payslip
- Month selector showing all available payslips
- Full breakdown per month: base salary, bonus, deductions, net pay
- Summary stats: total earned, average net pay, payslip count

#### 📅 My Attendance
- Mark present once per day (button disabled once marked)
- Full monthly calendar view with colour-coded days: green (present), red (absent), grey (unmarked)
- Previous months navigable via ← → controls
- Any past day with no record automatically shown as absent
- Monthly stats: present days, absent days, attendance rate
- Day-by-day log for the selected month

#### 👥 My Team
- View all colleagues in the same department
- Each card shows name, position, email, phone, join date, and status
- Own card highlighted in amber

#### 📰 News Feed
- Read-only view of all published company announcements
- Filter by category
- Expand/collapse post content inline

#### 🔑 Change Password
- Live requirements checklist (min 6 chars, different from current, passwords match)
- Submit disabled until all requirements are met

---

## Tech Stack

| Category  | Technology           |
|-----------|----------------------|
| Framework | React 18             |
| Build     | Vite 5               |
| Styling   | Tailwind CSS v4      |
| Routing   | React Router v6      |
| Charts    | Pure SVG (no library)|
| Fonts     | Sora + DM Sans (Google Fonts) |
| Data      | Static mock data     |
| Backend   | None (frontend only) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ShumaimRaza/hrcore.git
cd hrcore

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
hrcore/
│
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── main.jsx                     # ReactDOM root (no StrictMode)
    ├── App.jsx                      # All routes defined here
    ├── index.css                    # Tailwind import + global animations
    │
    ├── data/
    │   └── mockData.js              # Single source of truth for all mock data
    │
    ├── AuthContext.jsx          # Global auth state: login, register, logout
    │
    ├── components/
    │   ├── ProtectedRoute.jsx       # Route guard — auth check + adminOnly
    │   └── Layout.jsx               # Sidebar + topbar, role-aware nav, mobile drawer
    │
    └── pages/
        │
        ├── ── Public ──
        ├── Login.jsx
        ├── Register.jsx
        │
        ├── ── Admin ──
        ├── Dashboard.jsx
        ├── Departments.jsx
        ├── Employees.jsx
        ├── Leave.jsx
        ├── Salary.jsx
        ├── AdminAttendance.jsx
        │
        ├── ── Shared ──
        ├── News.jsx                 # Admin manages; employees read
        │
        └── ── Employee ──
            ├── EmployeeDashboard.jsx
            ├── MyProfile.jsx
            ├── MyLeave.jsx
            ├── MyPayslip.jsx
            ├── MyAttendance.jsx
            ├── Team.jsx
            └── ChangePassword.jsx
```

---

## Data Models

```js
// User — links to an employee record via employeeId
{ id, name, email, password, role, avatar, employeeId }
// role: "admin" | "employee"

// Employee
{ id, name, email, phone, departmentId, position, status, joinDate, salary, avatar }
// status: "active" | "on_leave" | "inactive"

// Department
{ id, name, headCount, managerId }

// Leave Request
{ id, employeeId, type, startDate, endDate, days, reason, status }
// status: "pending" | "approved" | "rejected"

// Salary Record
{ id, employeeId, month, baseSalary, bonus, deductions, total }
// month format: "YYYY-MM"

// News Post
{ id, title, category, content, publishedBy, publishedAt }
// category: "Announcement" | "Policy" | "Event" | "Achievement" | "Reminder"

// Attendance Record
{ id, employeeId, date, status }
// status: "present" | "absent"
// Any past date with no record is treated as absent in the UI
```

---

## Mobile Support

The app is fully responsive:
- Sidebar collapses into a **slide-over drawer** on mobile, toggled by the hamburger button
- All data tables use a **card-style layout** on mobile with key info visible and secondary columns hidden
- All forms stack to a **single column** on small screens
- Filter bars and dropdowns go **full width** on mobile
- The attendance calendar, payslip selector, and all modals are optimised for touch

