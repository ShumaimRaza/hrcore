import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import {
  EMPLOYEES, DEPARTMENTS, LEAVE_REQUESTS,
  SALARY_RECORDS, NEWS_POSTS, ATTENDANCE,
} from "../data/mockData";

// Runtime attendance state (shared with MyAttendance)
let attendanceRuntime = [...ATTENDANCE];
let nextAttId = Math.max(...ATTENDANCE.map((a) => a.id)) + 1;

const todayStr = new Date().toISOString().slice(0, 10);

const fmtMoney = (n) => `$${Number(n).toLocaleString()}`;
const fmtMonth = (m) => {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleString("default", { month: "long", year: "numeric" });
};

const categoryStyle = {
  Announcement: "text-amber-400   bg-amber-400/10   border-amber-400/20",
  Policy:       "text-cyan-400    bg-cyan-400/10    border-cyan-400/20",
  Event:        "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Achievement:  "text-purple-400  bg-purple-400/10  border-purple-400/20",
  Reminder:     "text-red-400     bg-red-400/10     border-red-400/20",
};

const leaveStatusStyle = {
  pending:  "text-amber-400   bg-amber-400/10   border-amber-400/20",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  rejected: "text-red-400     bg-red-400/10     border-red-400/20",
};

const empStatusStyle = {
  active:   { dot: "bg-emerald-400", text: "text-emerald-400" },
  on_leave: { dot: "bg-amber-400",   text: "text-amber-400"   },
  inactive: { dot: "bg-zinc-500",    text: "text-zinc-400"    },
};
const empStatusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };

// Section header used inside each widget
function WidgetHeader({ title, linkTo, linkLabel = "View all →" }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
      <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">{title}</p>
      {linkTo && (
        <Link to={linkTo} className="text-amber-400 text-xs hover:text-amber-300 transition-colors font-medium">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attRecords, setAttRecords] = useState(attendanceRuntime);

  const emp  = EMPLOYEES.find((e) => e.id === user?.employeeId);
  const dept = DEPARTMENTS.find((d) => d.id === emp?.departmentId);

  // Attendance
  const myAtt       = attRecords.filter((r) => r.employeeId === user?.employeeId);
  const todayRec    = myAtt.find((r) => r.date === todayStr);
  const markedToday = !!todayRec;
  const isPresent   = todayRec?.status === "present";

  // This month's stats
  const monthPrefix = todayStr.slice(0, 7);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysPassed  = new Date().getDate();
  const monthAtt    = myAtt.filter((r) => r.date.startsWith(monthPrefix));
  const presentDays = monthAtt.filter((r) => r.status === "present").length;
  const attRate     = daysPassed > 0 ? Math.round((presentDays / daysPassed) * 100) : 0;

  const handleMarkPresent = () => {
    if (markedToday) return;
    const rec = { id: nextAttId++, employeeId: user.employeeId, date: todayStr, status: "present" };
    attendanceRuntime = [...attendanceRuntime, rec];
    setAttRecords([...attendanceRuntime]);
  };

  // Leave
  const myLeave    = LEAVE_REQUESTS.filter((l) => l.employeeId === user?.employeeId);
  const pending    = myLeave.filter((l) => l.status === "pending").length;
  const approved   = myLeave.filter((l) => l.status === "approved").length;
  const recentLeave = [...myLeave].reverse().slice(0, 3);

  // Salary
  const myPayslips  = SALARY_RECORDS
    .filter((r) => r.employeeId === user?.employeeId)
    .sort((a, b) => b.month.localeCompare(a.month));
  const latestPayslip = myPayslips[0] ?? null;

  // News
  const latestNews = NEWS_POSTS.slice(0, 3);

  // Team
  const teammates = EMPLOYEES
    .filter((e) => e.departmentId === emp?.departmentId && e.id !== emp?.id)
    .slice(0, 5);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  if (!emp) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 text-sm">No employee record linked to your account.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome header */}
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{dateLabel}</p>
        <h1 className="font-display text-2xl font-bold text-white">
          {greeting}, <span className="text-amber-400">{emp.name.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-zinc-500 text-sm mt-1">{emp.position} · {dept?.name}</p>
      </div>

      {/* Top row: Attendance + Leave stats */}
      <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6" style={{ animationDelay: "0.05s" }}>
        {[
          { label: "This Month Present", value: presentDays,    sub: `${attRate}% rate`,    accent: "bg-emerald-500" },
          { label: "Today",              value: isPresent ? "Present" : "—", sub: isPresent ? "Marked ✓" : "Not marked", accent: isPresent ? "bg-emerald-500" : "bg-zinc-600" },
          { label: "Leave Pending",      value: pending,        sub: `${approved} approved`, accent: "bg-amber-400"   },
          { label: "Latest Net Pay",     value: latestPayslip ? fmtMoney(latestPayslip.total) : "—", sub: latestPayslip ? fmtMonth(latestPayslip.month) : "No records", accent: "bg-cyan-500" },
        ].map(({ label, value, sub, accent }, i) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-2xl font-bold text-white leading-none mb-1">{value}</p>
            <p className="text-zinc-600 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT column (spans 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Attendance widget */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.1s" }}>
            <WidgetHeader title="Attendance" linkTo="/my-attendance" />
            <div className="p-5 space-y-4">
              {/* Mark present CTA */}
              <div className={`flex items-center justify-between p-4 border ${isPresent ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-700 bg-zinc-800/50"}`}>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {isPresent ? "✓ You're marked present today" : "Mark yourself present for today"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">{dateLabel}</p>
                </div>
                <button
                  onClick={handleMarkPresent}
                  disabled={markedToday}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-display font-bold transition-colors ${
                    isPresent
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-300 text-zinc-900"
                  }`}
                >
                  {isPresent ? "Present ✓" : "Mark Present"}
                </button>
              </div>

              {/* Mini calendar strip — last 14 days */}
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">Last 14 Days</p>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (13 - i));
                    const ds = date.toISOString().slice(0, 10);
                    const rec = myAtt.find((r) => r.date === ds);
                    const isT = ds === todayStr;
                    const status = rec ? rec.status : ds < todayStr ? "absent" : "future";
                    const bg = status === "present" ? "bg-emerald-500" : status === "absent" ? "bg-red-500" : "bg-zinc-700";
                    const day = date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
                    return (
                      <div key={ds} className="flex flex-col items-center gap-0.5">
                        <span className="text-zinc-600 text-xs hidden sm:block">{day}</span>
                        <div
                          title={ds}
                          className={`w-full h-5 sm:h-6 rounded-sm ${bg} ${isT ? "ring-2 ring-white ring-offset-1 ring-offset-zinc-900" : ""} opacity-80`}
                        />
                        <span className="text-zinc-700 text-xs hidden sm:block">{date.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Leave widget */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.15s" }}>
            <WidgetHeader title="My Leave" linkTo="/my-leave" />
            {recentLeave.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-zinc-500 text-sm">No leave requests yet.</p>
                <Link to="/my-leave" className="text-amber-400 text-xs mt-2 inline-block hover:text-amber-300 transition-colors">
                  Apply for leave →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {recentLeave.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{leave.type} Leave</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{leave.startDate} → {leave.endDate} · {leave.days} day{leave.days !== 1 ? "s" : ""}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 border capitalize ${leaveStatusStyle[leave.status]}`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="px-5 py-3 border-t border-zinc-800">
              <Link
                to="/my-leave"
                className="w-full block text-center py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 transition-colors"
              >
                + Apply for Leave
              </Link>
            </div>
          </div>

          {/* News widget */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.2s" }}>
            <WidgetHeader title="Latest News" linkTo="/news" />
            <div className="divide-y divide-zinc-800">
              {latestNews.map((post) => {
                const catStyle = categoryStyle[post.category] ?? "text-zinc-400 bg-zinc-700 border-zinc-600";
                return (
                  <div key={post.id} className="px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 border ${catStyle}`}>{post.category}</span>
                      <span className="text-zinc-600 text-xs">{post.publishedAt}</span>
                    </div>
                    <p className="text-white text-sm font-semibold leading-snug">{post.title}</p>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">

          {/* Profile snapshot */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.1s" }}>
            <WidgetHeader title="My Profile" linkTo="/my-profile" linkLabel="View →" />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-zinc-900 font-display font-black text-lg">{emp.avatar}</span>
                </div>
                <div>
                  <p className="text-white font-display font-bold">{emp.name}</p>
                  <p className="text-zinc-400 text-sm">{emp.position}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${empStatusStyle[emp.status]?.dot}`} />
                    <span className={`text-xs font-semibold ${empStatusStyle[emp.status]?.text}`}>
                      {empStatusLabel[emp.status]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs border-t border-zinc-800 pt-3">
                {[
                  ["Department",  dept?.name ?? "—"],
                  ["Join Date",   emp.joinDate],
                  ["Email",       emp.email],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-zinc-600">{label}</span>
                    <span className="text-zinc-300 truncate ml-2 max-w-[140px] text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary snapshot */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.15s" }}>
            <WidgetHeader title="Latest Payslip" linkTo="/my-payslip" linkLabel="View all →" />
            {latestPayslip ? (
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">{fmtMonth(latestPayslip.month)}</span>
                </div>
                {[
                  { label: "Base",       value: fmtMoney(latestPayslip.baseSalary), color: "text-white"        },
                  { label: "+ Bonus",    value: fmtMoney(latestPayslip.bonus),       color: "text-emerald-400"  },
                  { label: "− Deductions", value: fmtMoney(latestPayslip.deductions), color: "text-red-400"    },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-zinc-800 pb-2 last:border-0">
                    <span className="text-zinc-500">{label}</span>
                    <span className={`font-medium ${color}`}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Net Pay</span>
                  <span className="font-display font-bold text-amber-400 text-xl">{fmtMoney(latestPayslip.total)}</span>
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-zinc-500 text-sm">No payslip records yet.</p>
              </div>
            )}
          </div>

          {/* Team widget */}
          <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.2s" }}>
            <WidgetHeader title="My Team" linkTo="/team" />
            <div className="p-5">
              <p className="text-zinc-500 text-xs mb-3">{dept?.name} · {EMPLOYEES.filter((e) => e.departmentId === emp.departmentId).length} members</p>
              <div className="space-y-3">
                {teammates.map((t) => {
                  const s = empStatusStyle[t.status];
                  return (
                    <div key={t.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-400">
                        {t.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{t.name}</p>
                        <p className="text-zinc-500 text-xs truncate">{t.position}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s?.dot}`} title={empStatusLabel[t.status]} />
                    </div>
                  );
                })}
              </div>
              {teammates.length === 0 && (
                <p className="text-zinc-600 text-xs">No other team members found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}