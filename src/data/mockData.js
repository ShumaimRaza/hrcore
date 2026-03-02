// ─── USERS / AUTH ────────────────────────────────────────────────────────────
// employeeId links a user account to an EMPLOYEES record
export const USERS = [
  { id: 1, name: "Admin User",    email: "admin@hr.com", password: "admin123", role: "admin",    avatar: "AU", employeeId: null },
  { id: 2, name: "Shumaim", email: "shumaim@hr.com", password: "shumaim123", role: "employee", avatar: "SH", employeeId: 9    },
];

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: 1, name: "Engineering",   headCount: 12, managerId: 1 },
  { id: 2, name: "Marketing",     headCount: 6,  managerId: null },
  { id: 3, name: "Human Resources", headCount: 4, managerId: null },
  { id: 4, name: "Finance",       headCount: 5,  managerId: null },
  { id: 5, name: "Operations",    headCount: 8,  managerId: null },
];

// ─── EMPLOYEES ───────────────────────────────────────────────────────────────
export const EMPLOYEES = [
  { id: 1,  name: "Alice Johnson",  email: "alice@hr.com",   phone: "+1 555-0101", departmentId: 1, position: "Frontend Engineer",    status: "active",   joinDate: "2022-03-15", salary: 90000,  avatar: "AJ" },
  { id: 2,  name: "Bob Martinez",   email: "bob@hr.com",     phone: "+1 555-0102", departmentId: 1, position: "Backend Engineer",     status: "active",   joinDate: "2021-07-01", salary: 95000,  avatar: "BM" },
  { id: 3,  name: "Carol White",    email: "carol@hr.com",   phone: "+1 555-0103", departmentId: 2, position: "Marketing Lead",       status: "active",   joinDate: "2023-01-10", salary: 75000,  avatar: "CW" },
  { id: 4,  name: "David Kim",      email: "david@hr.com",   phone: "+1 555-0104", departmentId: 3, position: "HR Specialist",        status: "active",   joinDate: "2020-11-20", salary: 68000,  avatar: "DK" },
  { id: 5,  name: "Eva Brown",      email: "eva@hr.com",     phone: "+1 555-0105", departmentId: 4, position: "Finance Analyst",      status: "on_leave", joinDate: "2022-06-05", salary: 72000,  avatar: "EB" },
  { id: 6,  name: "Frank Lee",      email: "frank@hr.com",   phone: "+1 555-0106", departmentId: 1, position: "DevOps Engineer",      status: "active",   joinDate: "2023-04-18", salary: 98000,  avatar: "FL" },
  { id: 7,  name: "Grace Chen",     email: "grace@hr.com",   phone: "+1 555-0107", departmentId: 5, position: "Operations Manager",   status: "active",   joinDate: "2019-09-30", salary: 85000,  avatar: "GC" },
  { id: 8,  name: "Henry Park",     email: "henry@hr.com",   phone: "+1 555-0108", departmentId: 2, position: "Content Strategist",   status: "inactive", joinDate: "2021-02-14", salary: 62000,  avatar: "HP" },
  { id: 9,  name: "Shumaim",        email: "shumaim@hr.com", phone: "+1 555-0109", departmentId: 1, position: "Junior Developer",      status: "active",   joinDate: "2023-08-01", salary: 70000,  avatar: "JE" },
];

// ─── LEAVE REQUESTS ──────────────────────────────────────────────────────────
export const LEAVE_REQUESTS = [
  { id: 1, employeeId: 1, type: "Annual",   startDate: "2024-02-05", endDate: "2024-02-07", days: 3, reason: "Family vacation",        status: "approved" },
  { id: 2, employeeId: 5, type: "Sick",     startDate: "2024-02-12", endDate: "2024-02-14", days: 3, reason: "Medical appointment",     status: "approved" },
  { id: 3, employeeId: 3, type: "Annual",   startDate: "2024-02-20", endDate: "2024-02-21", days: 2, reason: "Personal errands",        status: "pending"  },
  { id: 4, employeeId: 7, type: "Maternity",startDate: "2024-03-01", endDate: "2024-05-31", days: 91,reason: "Maternity leave",         status: "approved" },
  { id: 5, employeeId: 2, type: "Annual",   startDate: "2024-03-10", endDate: "2024-03-12", days: 3, reason: "Holiday travel",          status: "pending"  },
  { id: 6, employeeId: 6, type: "Sick",     startDate: "2024-02-28", endDate: "2024-02-28", days: 1, reason: "Not feeling well",        status: "rejected" },
  { id: 7, employeeId: 9, type: "Annual",   startDate: "2024-01-15", endDate: "2024-01-17", days: 3, reason: "Personal trip",            status: "approved" },
  { id: 8, employeeId: 9, type: "Sick",     startDate: "2024-03-05", endDate: "2024-03-05", days: 1, reason: "Feeling unwell",           status: "approved" },
  { id: 9, employeeId: 9, type: "Annual",   startDate: "2024-04-20", endDate: "2024-04-24", days: 5, reason: "Family holiday",           status: "pending"  },
];

// ─── SALARY RECORDS ──────────────────────────────────────────────────────────
export const SALARY_RECORDS = [
  { id: 1, employeeId: 1, month: "2024-01", baseSalary: 90000, bonus: 5000,  deductions: 2000, total: 93000  },
  { id: 2, employeeId: 2, month: "2024-01", baseSalary: 95000, bonus: 8000,  deductions: 2500, total: 100500 },
  { id: 3, employeeId: 3, month: "2024-01", baseSalary: 75000, bonus: 3000,  deductions: 1500, total: 76500  },
  { id: 4, employeeId: 4, month: "2024-01", baseSalary: 68000, bonus: 2000,  deductions: 1200, total: 68800  },
  { id: 5, employeeId: 5, month: "2024-01", baseSalary: 72000, bonus: 0,     deductions: 1800, total: 70200  },
  { id: 6, employeeId: 6, month: "2024-01", baseSalary: 98000, bonus: 10000, deductions: 3000, total: 105000 },
  { id: 7, employeeId: 7, month: "2024-01", baseSalary: 85000, bonus: 6000,  deductions: 2200, total: 88800  },
  { id: 8, employeeId: 8, month: "2024-01", baseSalary: 62000, bonus: 1000,  deductions: 1100, total: 61900  },
  { id: 9, employeeId: 9, month: "2024-01", baseSalary: 70000, bonus: 2000,  deductions: 1500, total: 70500  },
  { id: 10, employeeId: 9, month: "2024-02", baseSalary: 70000, bonus: 0,    deductions: 1500, total: 68500  },
  { id: 11, employeeId: 9, month: "2024-03", baseSalary: 70000, bonus: 3000, deductions: 1500, total: 71500  },
];

// ─── NEWS POSTS ───────────────────────────────────────────────────────────────
export const NEWS_POSTS = [
  { id: 1, title: "Q1 2024 Company Performance Update", category: "Announcement", content: "We are pleased to share that Q1 2024 has been a strong quarter. Revenue grew by 18% compared to Q1 last year, and we successfully onboarded 3 major enterprise clients. A huge thank you to every team member for your dedication and hard work.", publishedBy: "Admin User", publishedAt: "2024-03-28" },
  { id: 2, title: "New Office Hours Policy Effective April 1st", category: "Policy", content: "Starting April 1st, core office hours will be 10:00 AM to 4:00 PM. Flexible working arrangements outside these hours are available with manager approval. Please review the updated HR policy document for full details.", publishedBy: "Admin User", publishedAt: "2024-03-25" },
  { id: 3, title: "Annual Company Picnic — Save the Date!", category: "Event", content: "Mark your calendars! The annual company picnic will be held on May 18th at Riverside Park. Bring your families and get ready for food, games, and a great time with your colleagues. More details coming soon.", publishedBy: "Admin User", publishedAt: "2024-03-20" },
  { id: 4, title: "Engineering Team Wins Internal Hackathon", category: "Achievement", content: "Congratulations to the Engineering team for winning this year's internal hackathon with their AI-powered leave forecasting tool. Their project will be fast-tracked into our product roadmap for Q3.", publishedBy: "Admin User", publishedAt: "2024-03-15" },
  { id: 5, title: "Reminder: Performance Reviews Due March 31st", category: "Reminder", content: "This is a reminder that all self-assessment forms for the Q1 performance review cycle are due by March 31st. Please submit your forms via the HR portal. Reach out to the HR team if you have any questions.", publishedBy: "Admin User", publishedAt: "2024-03-10" },
];

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
// status: "present" | "absent"
// Auto-absent logic: any past date with no record is treated as absent in the UI
const today = new Date();
const d = (offset) => {
  const date = new Date(today);
  date.setDate(today.getDate() - offset);
  return date.toISOString().slice(0, 10);
};

export const ATTENDANCE = [
  // Jane (employeeId: 9) — last 14 days
  { id: 1,  employeeId: 9, date: d(0),  status: "present" },
  { id: 2,  employeeId: 9, date: d(1),  status: "present" },
  { id: 3,  employeeId: 9, date: d(2),  status: "absent"  },
  { id: 4,  employeeId: 9, date: d(3),  status: "present" },
  { id: 5,  employeeId: 9, date: d(4),  status: "present" },
  { id: 6,  employeeId: 9, date: d(5),  status: "present" },
  { id: 7,  employeeId: 9, date: d(7),  status: "present" },
  { id: 8,  employeeId: 9, date: d(8),  status: "absent"  },
  { id: 9,  employeeId: 9, date: d(9),  status: "present" },
  { id: 10, employeeId: 9, date: d(10), status: "present" },
  // Other employees — sample records
  { id: 11, employeeId: 1, date: d(0),  status: "present" },
  { id: 12, employeeId: 1, date: d(1),  status: "present" },
  { id: 13, employeeId: 1, date: d(2),  status: "present" },
  { id: 14, employeeId: 2, date: d(0),  status: "present" },
  { id: 15, employeeId: 2, date: d(1),  status: "absent"  },
  { id: 16, employeeId: 2, date: d(2),  status: "present" },
  { id: 17, employeeId: 3, date: d(0),  status: "absent"  },
  { id: 18, employeeId: 3, date: d(1),  status: "present" },
  { id: 19, employeeId: 4, date: d(0),  status: "present" },
  { id: 20, employeeId: 5, date: d(0),  status: "absent"  },
  { id: 21, employeeId: 6, date: d(0),  status: "present" },
  { id: 22, employeeId: 7, date: d(0),  status: "present" },
  { id: 23, employeeId: 8, date: d(0),  status: "absent"  },
];