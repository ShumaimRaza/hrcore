import { useState } from "react";
import Layout from "../components/Layout";
import { LEAVE_REQUESTS, EMPLOYEES } from "../data/mockData";

//  Runtime state 
let leaveRequests = [...LEAVE_REQUESTS];
let nextId = Math.max(...LEAVE_REQUESTS.map((l) => l.id)) + 1;

//  Helpers
const getEmployee = (id) => EMPLOYEES.find((e) => e.id === id);
const statusStyle = {
  pending:  { text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20",   dot: "bg-amber-400"   },
  approved: { text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  rejected: { text: "text-red-400",     bg: "bg-red-400/10 border-red-400/20",       dot: "bg-red-400"     },
};
const LEAVE_TYPES = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid"];

//  Modal Shell
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 bg-zinc-900 border border-zinc-700 w-full ${wide ? "max-w-lg" : "max-w-md"} fade-up max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

//  Apply Leave Form 
function ApplyLeaveForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    employeeId: EMPLOYEES[0]?.id ?? 1,
    type: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate) return setError("Start date is required.");
    if (!form.endDate)   return setError("End date is required.");
    if (new Date(form.endDate) < new Date(form.startDate)) return setError("End date must be after start date.");
    if (!form.reason.trim()) return setError("Reason is required.");
    onSave({ ...form, employeeId: Number(form.employeeId), days: calcDays(), status: "pending" });
  };

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";
  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}

      <Field label="Employee">
        <select className={inputCls} value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)}>
          {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>

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
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">Submit Request →</button>
      </div>
    </form>
  );
}

//  Leave Detail Modal
function LeaveDetail({ leave, onClose, onApprove, onReject }) {
  const emp = getEmployee(leave.employeeId);
  const s = statusStyle[leave.status];

  return (
    <div className="space-y-5">
      {/* Employee */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-900 font-display font-black text-sm">{emp?.avatar}</span>
        </div>
        <div>
          <p className="text-white font-display font-bold">{emp?.name}</p>
          <p className="text-zinc-400 text-sm">{emp?.position}</p>
        </div>
        <span className={`ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text} capitalize`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {leave.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Leave Type",  leave.type],
          ["Duration",    `${leave.days} day${leave.days !== 1 ? "s" : ""}`],
          ["Start Date",  leave.startDate],
          ["End Date",    leave.endDate],
        ].map(([label, value]) => (
          <div key={label} className="bg-zinc-800 border border-zinc-700 px-4 py-3">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800 border border-zinc-700 px-4 py-3">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Reason</p>
        <p className="text-white text-sm">{leave.reason}</p>
      </div>

      {/* Actions — only show if pending */}
      {leave.status === "pending" && (
        <div className="flex gap-3 pt-2">
          <button onClick={onReject}  className="flex-1 px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors font-semibold">Reject</button>
          <button onClick={onApprove} className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold text-sm transition-colors">Approve →</button>
        </div>
      )}
    </div>
  );
}

//  Leave Management Page
export default function Leave() {
  const [list, setList]         = useState(leaveRequests);
  const [modal, setModal]       = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter]     = useState("all");

  const refresh = () => setList([...leaveRequests]);

  const filtered = list.filter((l) => {
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchType   = typeFilter   === "all" || l.type   === typeFilter;
    return matchStatus && matchType;
  });

  const handleApply = (data) => {
    leaveRequests = [...leaveRequests, { id: nextId++, ...data }];
    refresh();
    setModal(null);
  };

  const handleApprove = () => {
    leaveRequests = leaveRequests.map((l) => l.id === modal.leave.id ? { ...l, status: "approved" } : l);
    refresh();
    setModal(null);
  };

  const handleReject = () => {
    leaveRequests = leaveRequests.map((l) => l.id === modal.leave.id ? { ...l, status: "rejected" } : l);
    refresh();
    setModal(null);
  };

  // Stats
  const stats = {
    total:    list.length,
    pending:  list.filter((l) => l.status === "pending").length,
    approved: list.filter((l) => l.status === "approved").length,
    rejected: list.filter((l) => l.status === "rejected").length,
  };

  return (
    <Layout>
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Management</p>
          <h1 className="font-display text-2xl font-bold text-white">Leave Management</h1>
        </div>
        <button
          onClick={() => setModal({ type: "apply" })}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
        >
          <span>+</span> Apply Leave
        </button>
      </div>

      {/* Stat Cards */}
      <div className="fade-up grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",    value: stats.total,    accent: "bg-zinc-500"    },
          { label: "Pending",  value: stats.pending,  accent: "bg-amber-400"   },
          { label: "Approved", value: stats.approved, accent: "bg-emerald-500" },
          { label: "Rejected", value: stats.rejected, accent: "bg-red-500"     },
        ].map(({ label, value, accent }, i) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Types</option>
          {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Leave Table */}
      <div className="fade-up bg-zinc-900 border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            {filtered.length} request{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
          <span className="col-span-3">Employee</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2">Duration</span>
          <span className="col-span-2">Dates</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1 text-right">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-500 text-sm">No leave requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((leave, i) => {
              const emp = getEmployee(leave.employeeId);
              const s   = statusStyle[leave.status];
              return (
                <div
                  key={leave.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors cursor-pointer fade-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => setModal({ type: "detail", leave })}
                >
                  {/* Employee */}
                  <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                      {emp?.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{emp?.name}</p>
                      <p className="text-zinc-500 text-xs md:hidden capitalize">{leave.status}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="hidden md:block col-span-2">
                    <span className="text-zinc-300 text-sm">{leave.type}</span>
                  </div>

                  {/* Duration */}
                  <div className="hidden md:block col-span-2">
                    <span className="text-zinc-300 text-sm">{leave.days} day{leave.days !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Dates */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-zinc-400 text-xs">{leave.startDate}</p>
                    <p className="text-zinc-600 text-xs">→ {leave.endDate}</p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block col-span-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text} capitalize`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {leave.status}
                    </span>
                  </div>

                  {/* Quick action for pending */}
                  <div className="col-span-5 md:col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {leave.status === "pending" ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => { leaveRequests = leaveRequests.map((l) => l.id === leave.id ? { ...l, status: "approved" } : l); refresh(); }}
                          className="px-2 py-1 text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          title="Approve"
                        >✓</button>
                        <button
                          onClick={() => { leaveRequests = leaveRequests.map((l) => l.id === leave.id ? { ...l, status: "rejected" } : l); refresh(); }}
                          className="px-2 py-1 text-xs bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Reject"
                        >✕</button>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-xs">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "apply" && (
        <Modal title="Apply for Leave" onClose={() => setModal(null)} wide>
          <ApplyLeaveForm onSave={handleApply} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "detail" && (
        <Modal title="Leave Request" onClose={() => setModal(null)} wide>
          <LeaveDetail
            leave={modal.leave}
            onClose={() => setModal(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </Modal>
      )}
    </Layout>
  );
}