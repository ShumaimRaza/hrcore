import { useState } from "react";
import Layout from "../components/Layout";
import { ATTENDANCE, EMPLOYEES, DEPARTMENTS } from "../data/mockData";

const today = new Date().toISOString().slice(0, 10);

const getLast14Days = () =>
  Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

const getStatus = (employeeId, date, records) => {
  const rec = records.find((r) => r.employeeId === employeeId && r.date === date);
  if (rec) return rec.status;
  if (date === today) return "unmarked";
  return "absent";
};

const statusStyle = {
  present:  { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  absent:   { dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10 border-red-400/20"         },
  unmarked: { dot: "bg-zinc-600",    text: "text-zinc-400",    bg: "bg-zinc-700/30 border-zinc-700"           },
};

export default function AdminAttendance() {
  const [deptFilter, setDeptFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(today);
  const days = getLast14Days();

  const filteredEmployees = EMPLOYEES.filter((e) =>
    deptFilter === "all" || e.departmentId === Number(deptFilter)
  );

  // Stats for selected date
  const presentToday  = filteredEmployees.filter((e) => getStatus(e.id, dateFilter, ATTENDANCE) === "present").length;
  const absentToday   = filteredEmployees.filter((e) => getStatus(e.id, dateFilter, ATTENDANCE) === "absent").length;
  const unmarkedToday = filteredEmployees.filter((e) => getStatus(e.id, dateFilter, ATTENDANCE) === "unmarked").length;

  const formatDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const shortDate  = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Management</p>
        <h1 className="font-display text-2xl font-bold text-white">Attendance</h1>
      </div>

      {/* Filters */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          {days.map((d) => (
            <option key={d} value={d}>{formatDate(d)}{d === today ? " (Today)" : ""}</option>
          ))}
        </select>
      </div>

      {/* Stats for selected date */}
      <div className="fade-up grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Present",  value: presentToday,  accent: "bg-emerald-500" },
          { label: "Absent",   value: absentToday,   accent: "bg-red-500"     },
          { label: "Unmarked", value: unmarkedToday, accent: "bg-zinc-500"    },
        ].map(({ label, value, accent }, i) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
            <p className="text-zinc-600 text-xs mt-0.5">{formatDate(dateFilter)}</p>
          </div>
        ))}
      </div>

      {/* Per-employee table for selected date */}
      <div className="fade-up bg-zinc-900 border border-zinc-800 mb-6">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            Daily View — {formatDate(dateFilter)}
          </p>
        </div>
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
          <span className="col-span-4">Employee</span>
          <span className="col-span-3">Department</span>
          <span className="col-span-3">Position</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {filteredEmployees.map((emp, i) => {
            const status = getStatus(emp.id, dateFilter, ATTENDANCE);
            const s = statusStyle[status];
            const dept = DEPARTMENTS.find((d) => d.id === emp.departmentId);
            return (
              <div key={emp.id} className="grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-zinc-800/40 transition-colors fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="col-span-8 md:col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <p className="text-white text-sm font-medium truncate">{emp.name}</p>
                </div>
                <div className="hidden md:block col-span-3">
                  <p className="text-zinc-400 text-sm">{dept?.name}</p>
                </div>
                <div className="hidden md:block col-span-3">
                  <p className="text-zinc-400 text-sm truncate">{emp.position}</p>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-end md:justify-start">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text} capitalize`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-day heatmap */}
      <div className="fade-up bg-zinc-900 border border-zinc-800 p-6" style={{ animationDelay: "0.2s" }}>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-5">14-Day Overview</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-zinc-500 font-semibold pb-3 pr-4 w-36">Employee</th>
                {days.map((d) => (
                  <th key={d} className={`text-center pb-3 px-1 font-semibold ${d === today ? "text-amber-400" : "text-zinc-500"}`}>
                    {shortDate(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="py-2 pr-4 text-zinc-300 font-medium truncate max-w-[140px]">{emp.name.split(" ")[0]}</td>
                  {days.map((d) => {
                    const status = getStatus(emp.id, d, ATTENDANCE);
                    const color = status === "present" ? "bg-emerald-400" : status === "absent" ? "bg-red-400" : "bg-zinc-700";
                    return (
                      <td key={d} className="py-2 px-1 text-center">
                        <div className={`w-5 h-5 ${color} rounded-sm mx-auto opacity-80 hover:opacity-100 transition-opacity cursor-default`} title={`${emp.name} — ${d}: ${status}`} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500 mt-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" /> Present</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-700 inline-block" /> Unmarked</span>
        </div>
      </div>
    </Layout>
  );
}