import { useMemo } from "react";
import Layout from "../components/Layout";
import { EMPLOYEES, DEPARTMENTS, LEAVE_REQUESTS, SALARY_RECORDS } from "../data/mockData";

// Stat Card
function StatCard({ label, value, sub, accent, delay }) {
  return (
    <div
      className="fade-up bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
      <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-3">{label}</p>
      <p className="font-display text-4xl font-bold text-white mb-1">{value}</p>
      <p className="text-zinc-500 text-xs">{sub}</p>
    </div>
  );
}

// Bar Chart (Monthly Hiring)
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map(({ label, value }) => {
        const pct = (value / max) * 100;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-zinc-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {value}
            </span>
            <div className="w-full relative flex items-end" style={{ height: "100px" }}>
              <div
                className="w-full bg-amber-400 hover:bg-amber-300 transition-all duration-300 rounded-t-sm"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <span className="text-zinc-500 text-xs">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Pie / Donut Chart (Leave Distribution) 
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const COLORS = ["#fbbf24", "#52525b", "#ef4444", "#22d3ee"];

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = 60;
    const cx = 80, cy = 80;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return {
      ...d,
      color: COLORS[i % COLORS.length],
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity" />
        ))}
        {/* Donut hole */}
        <circle cx="80" cy="80" r="36" fill="#18181b" />
        <text x="80" y="76" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Sora">
          {total}
        </text>
        <text x="80" y="91" textAnchor="middle" fill="#71717a" fontSize="9" fontFamily="DM Sans">
          REQUESTS
        </text>
      </svg>

      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-zinc-400 text-xs">{s.label}</span>
            <span className="text-white text-xs font-semibold ml-auto pl-4">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard Page 
export default function Dashboard() {
  const stats = useMemo(() => {
    const totalEmployees = EMPLOYEES.length;
    const onLeave = EMPLOYEES.filter((e) => e.status === "on_leave").length;
    const totalDepts = DEPARTMENTS.length;
    const totalPayroll = SALARY_RECORDS.reduce((s, r) => s + r.total, 0);

    return { totalEmployees, onLeave, totalDepts, totalPayroll };
  }, []);

  // Monthly hiring — derive from joinDate
  const hiringData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);
    EMPLOYEES.forEach((e) => {
      const m = new Date(e.joinDate).getMonth();
      counts[m]++;
    });
    // Show last 8 months
    return months.slice(0, 8).map((label, i) => ({ label, value: counts[i] }));
  }, []);

  // Leave distribution by type
  const leaveData = useMemo(() => {
    const counts = {};
    LEAVE_REQUESTS.forEach((l) => {
      counts[l.type] = (counts[l.type] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, []);

  // Recent leave requests
  const recentLeave = LEAVE_REQUESTS.slice(0, 4).map((l) => ({
    ...l,
    employeeName: EMPLOYEES.find((e) => e.id === l.employeeId)?.name || "Unknown",
  }));

  const statusColor = { approved: "text-amber-400", pending: "text-zinc-400", rejected: "text-red-400" };
  const statusBg    = { approved: "bg-amber-400/10 border-amber-400/20", pending: "bg-zinc-700/30 border-zinc-700", rejected: "bg-red-400/10 border-red-400/20" };

  return (
    <Layout>
      {/* Page header */}
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees"   value={stats.totalEmployees} sub="Across all departments"    accent="bg-amber-400"  delay={0.05} />
        <StatCard label="On Leave"          value={stats.onLeave}        sub="Currently out of office"   accent="bg-zinc-500"  delay={0.10} />
        <StatCard label="Departments"       value={stats.totalDepts}     sub="Active departments"         accent="bg-cyan-500"  delay={0.15} />
        <StatCard
          label="Monthly Payroll"
          value={`$${(stats.totalPayroll / 1000).toFixed(0)}k`}
          sub="Total salary disbursed"
          accent="bg-emerald-500"
          delay={0.20}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Hiring Chart — takes 2/3 */}
        <div className="fade-up lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Hiring Trend</p>
              <p className="font-display text-white font-bold">Monthly Hires</p>
            </div>
            <span className="text-zinc-600 text-xs border border-zinc-800 px-3 py-1">2024</span>
          </div>
          <BarChart data={hiringData} />
        </div>

        {/* Leave Pie — takes 1/3 */}
        <div className="fade-up bg-zinc-900 border border-zinc-800 p-6" style={{ animationDelay: "0.30s" }}>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Leave Types</p>
          <p className="font-display text-white font-bold mb-6">Distribution</p>
          <DonutChart data={leaveData} />
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="fade-up bg-zinc-900 border border-zinc-800" style={{ animationDelay: "0.35s" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-0.5">Activity</p>
            <p className="font-display text-white font-bold">Recent Leave Requests</p>
          </div>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentLeave.map((l) => (
            <div key={l.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                  {l.employeeName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{l.employeeName}</p>
                  <p className="text-zinc-500 text-xs">{l.type} · {l.days} day{l.days > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 text-xs hidden sm:block">{l.startDate}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 border ${statusBg[l.status]} ${statusColor[l.status]} capitalize`}>
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}