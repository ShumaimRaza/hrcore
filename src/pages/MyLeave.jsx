import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { LEAVE_REQUESTS } from "../data/mockData";

//  Runtime state 
let leaveRequests = [...LEAVE_REQUESTS];
let nextId = Math.max(...LEAVE_REQUESTS.map((l) => l.id)) + 1;

const LEAVE_TYPES = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid"];
const statusStyle = {
  pending:  { text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20",    dot: "bg-amber-400"   },
  approved: { text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  rejected: { text: "text-red-400",     bg: "bg-red-400/10 border-red-400/20",        dot: "bg-red-400"     },
};

//  Modal
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 w-full max-w-md fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function MyLeave() {
  const { user } = useAuth();
  const [list, setList]         = useState(leaveRequests);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ type: "Annual", startDate: "", endDate: "", reason: "" });
  const [error, setError]  = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const myRequests = list
    .filter((l) => l.employeeId === user?.employeeId)
    .filter((l) => statusFilter === "all" || l.status === statusFilter);

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.startDate) return setError("Start date is required.");
    if (!form.endDate)   return setError("End date is required.");
    if (new Date(form.endDate) < new Date(form.startDate)) return setError("End date must be after start date.");
    if (!form.reason.trim()) return setError("Reason is required.");

    const newReq = {
      id: nextId++,
      employeeId: user.employeeId,
      ...form,
      days: calcDays(),
      status: "pending",
    };
    leaveRequests = [...leaveRequests, newReq];
    setList([...leaveRequests]);
    setForm({ type: "Annual", startDate: "", endDate: "", reason: "" });
    setShowForm(false);
    setSuccess("Leave request submitted successfully!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";
  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );

  // Stats
  const all     = list.filter((l) => l.employeeId === user?.employeeId);
  const stats   = {
    total:    all.length,
    pending:  all.filter((l) => l.status === "pending").length,
    approved: all.filter((l) => l.status === "approved").length,
    totalDays: all.filter((l) => l.status === "approved").reduce((s, l) => s + l.days, 0),
  };

  return (
    <Layout>
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Employee</p>
          <h1 className="font-display text-2xl font-bold text-white">My Leave</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
        >
          <span>+</span> Apply for Leave
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="fade-up mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3">
          {success}
        </div>
      )}

      {/* Stat cards */}
      <div className="fade-up grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Requests", value: stats.total,    accent: "bg-zinc-500"    },
          { label: "Pending",        value: stats.pending,  accent: "bg-amber-400"   },
          { label: "Approved",       value: stats.approved, accent: "bg-emerald-500" },
          { label: "Days Taken",     value: stats.totalDays,accent: "bg-cyan-500"    },
        ].map(({ label, value, accent }, i) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="fade-up mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Leave history */}
      <div className="fade-up bg-zinc-900 border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            {myRequests.length} request{myRequests.length !== 1 ? "s" : ""}
          </p>
        </div>

        {myRequests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-500 text-sm">No leave requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {myRequests.map((leave, i) => {
              const s = statusStyle[leave.status];
              return (
                <div
                  key={leave.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Type + reason */}
                  <div className="col-span-8 sm:col-span-4">
                    <p className="text-white text-sm font-medium">{leave.type} Leave</p>
                    <p className="text-zinc-500 text-xs mt-0.5 truncate">{leave.reason}</p>
                  </div>
                  {/* Duration */}
                  <div className="hidden sm:block col-span-2">
                    <p className="text-zinc-300 text-sm">{leave.days} day{leave.days !== 1 ? "s" : ""}</p>
                  </div>
                  {/* Dates */}
                  <div className="hidden sm:block col-span-3">
                    <p className="text-zinc-400 text-xs">{leave.startDate}</p>
                    <p className="text-zinc-600 text-xs">→ {leave.endDate}</p>
                  </div>
                  {/* Status */}
                  <div className="col-span-4 sm:col-span-3 flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text} capitalize`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {leave.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply modal */}
      {showForm && (
        <Modal title="Apply for Leave" onClose={() => { setShowForm(false); setError(""); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}

            <Field label="Leave Type">
              <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Start Date">
                <input type="date" className={inputCls} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </Field>
              <Field label="End Date">
                <input type="date" className={inputCls} value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
              </Field>
            </div>

            {calcDays() > 0 && (
              <div className="bg-amber-400/10 border border-amber-400/20 px-4 py-3 text-amber-400 text-sm">
                Duration: <span className="font-bold">{calcDays()} day{calcDays() !== 1 ? "s" : ""}</span>
              </div>
            )}

            <Field label="Reason">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                placeholder="Brief reason for leave..."
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">Submit →</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}