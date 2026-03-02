import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { ATTENDANCE } from "../data/mockData";

// Runtime state 
let attendance = [...ATTENDANCE];
let nextId = Math.max(...ATTENDANCE.map((a) => a.id)) + 1;

const todayStr = () => new Date().toISOString().slice(0, 10);

const statusStyle = {
  present:  { bg: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500", label: "Present"  },
  absent:   { bg: "bg-red-500",     text: "text-red-400",     ring: "ring-red-500",     label: "Absent"   },
  unmarked: { bg: "bg-zinc-700",    text: "text-zinc-500",    ring: "ring-zinc-600",    label: "Unmarked" },
  future:   { bg: "bg-transparent", text: "text-zinc-700",    ring: "",                 label: ""         },
};

const getMonthDays = (year, month) => {
  const total = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: total }, (_, i) => {
    const d = i + 1;
    return {
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      dayNum: d,
    };
  });
};

const WEEKDAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function MyAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState(attendance);

  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const myRecords      = records.filter((r) => r.employeeId === user?.employeeId);
  const todayRecord    = myRecords.find((r) => r.date === todayStr());
  const markedToday    = !!todayRecord;
  const alreadyPresent = todayRecord?.status === "present";

  const handleMarkPresent = () => {
    if (markedToday) return;
    const newRecord = { id: nextId++, employeeId: user.employeeId, date: todayStr(), status: "present" };
    attendance = [...attendance, newRecord];
    setRecords([...attendance]);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const monthDays    = getMonthDays(viewYear, viewMonth);
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const today        = todayStr();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const getDayStatus = (date) => {
    if (date > today) return "future";
    const rec = myRecords.find((r) => r.date === date);
    if (rec) return rec.status;
    if (date === today) return "unmarked";
    return "absent";
  };

  // Stats for the viewed month
  const monthDayStatuses = monthDays
    .filter((d) => d.date <= today)
    .map((d) => getDayStatus(d.date));

  const presentCount = monthDayStatuses.filter((s) => s === "present").length;
  const absentCount  = monthDayStatuses.filter((s) => s === "absent").length;
  const rate = presentCount + absentCount > 0
    ? Math.round((presentCount / (presentCount + absentCount)) * 100)
    : 0;

  const formatDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Employee</p>
        <h1 className="font-display text-2xl font-bold text-white">My Attendance</h1>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Today check-in */}
        <div className="fade-up bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${alreadyPresent ? "bg-emerald-400" : "bg-zinc-600"}`} />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Today</p>
              <p className="font-display text-white font-bold text-lg">{formatDate(today)}</p>
              {alreadyPresent
                ? <p className="text-emerald-400 text-sm mt-1 font-medium">✓ Attendance marked</p>
                : <p className="text-zinc-500 text-sm mt-1">You haven't marked attendance yet</p>
              }
            </div>
            <button
              onClick={handleMarkPresent}
              disabled={markedToday}
              className={`flex-shrink-0 px-6 py-3 font-display font-bold text-sm transition-colors ${
                alreadyPresent
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-300 text-zinc-900"
              }`}
            >
              {alreadyPresent ? "✓ Present" : "Mark Present"}
            </button>
          </div>
        </div>

        {/* Monthly stats */}
        <div className="fade-up grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ animationDelay: "0.08s" }}>
          {[
            { label: "Present",    value: presentCount, accent: "bg-emerald-500" },
            { label: "Absent",     value: absentCount,  accent: "bg-red-500"     },
            { label: "Attendance", value: `${rate}%`,   accent: "bg-amber-400"   },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
              <p className="font-display text-3xl font-bold text-white">{value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{MONTH_NAMES[viewMonth]} {viewYear}</p>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.12s" }}>
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg"
            >‹</button>
            <p className="font-display font-bold text-white tracking-wide">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </p>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg disabled:opacity-25 disabled:cursor-not-allowed"
            >›</button>
          </div>

          <div className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-zinc-600 text-xs font-semibold uppercase tracking-wider py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty cells before first day */}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {monthDays.map(({ date, dayNum }) => {
                const status   = getDayStatus(date);
                const s        = statusStyle[status];
                const isToday  = date === today;
                const isFuture = status === "future";

                return (
                  <div
                    key={date}
                    title={!isFuture ? `${formatDate(date)}: ${s.label}` : ""}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-sm
                      text-xs font-bold select-none transition-opacity
                      ${isFuture ? "opacity-20" : ""}
                      ${!isFuture ? `${s.bg} text-white` : "text-zinc-700"}
                      ${isToday ? `ring-2 ${s.ring} ring-offset-2 ring-offset-zinc-900` : ""}
                    `}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center flex-wrap gap-4 mt-5 pt-4 border-t border-zinc-800 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-700 inline-block" /> Unmarked</span>
            </div>
          </div>
        </div>

        {/* Day-by-day list for the month */}
        <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.16s" }}>
          <div className="px-6 py-4 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
              {MONTH_NAMES[viewMonth]} {viewYear} — Day Log
            </p>
          </div>
          <div className="divide-y divide-zinc-800 max-h-72 overflow-y-auto">
            {monthDays
              .filter((d) => d.date <= today)
              .reverse()
              .map(({ date }) => {
                const status  = getDayStatus(date);
                const s       = statusStyle[status];
                const isToday = date === todayStr();
                return (
                  <div key={date} className="flex items-center justify-between px-6 py-3 hover:bg-zinc-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.bg}`} />
                      <p className="text-zinc-300 text-sm">
                        {formatDate(date)}
                        {isToday && <span className="text-amber-400 text-xs font-semibold ml-2">Today</span>}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </Layout>
  );
}