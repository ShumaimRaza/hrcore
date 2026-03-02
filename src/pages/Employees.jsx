import { useState } from "react";
import Layout from "../components/Layout";
import { EMPLOYEES, DEPARTMENTS } from "../data/mockData";

// Runtime state 
let employees = [...EMPLOYEES];
let nextId = Math.max(...EMPLOYEES.map((e) => e.id)) + 1;

// Helpers 
const getDeptName = (id) => DEPARTMENTS.find((d) => d.id === id)?.name ?? "—";
const statusStyle = {
  active:   { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  on_leave: { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20"   },
  inactive: { dot: "bg-zinc-500",    text: "text-zinc-400",    bg: "bg-zinc-700/30 border-zinc-700"         },
};
const statusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };

// Modal Shell 
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 bg-zinc-900 border border-zinc-700 w-full ${wide ? "max-w-2xl" : "max-w-md"} fade-up max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Employee Form 
function EmployeeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:         initial?.name         ?? "",
    email:        initial?.email        ?? "",
    phone:        initial?.phone        ?? "",
    position:     initial?.position     ?? "",
    departmentId: initial?.departmentId ?? DEPARTMENTS[0]?.id ?? 1,
    status:       initial?.status       ?? "active",
    joinDate:     initial?.joinDate     ?? new Date().toISOString().slice(0, 10),
    salary:       initial?.salary       ?? "",
  });
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (!form.position.trim()) return setError("Position is required.");
    onSave({ ...form, departmentId: Number(form.departmentId), salary: Number(form.salary) || 0 });
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" />
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555-0100" />
        </Field>
        <Field label="Position">
          <input className={inputCls} value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="Frontend Engineer" />
        </Field>
        <Field label="Department">
          <select className={inputCls} value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
            {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Join Date">
          <input type="date" className={inputCls} value={form.joinDate} onChange={(e) => set("joinDate", e.target.value)} />
        </Field>
        <Field label="Salary (USD)">
          <input type="number" className={inputCls} value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="75000" />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">
          {initial ? "Save Changes" : "Add Employee"} →
        </button>
      </div>
    </form>
  );
}

// Employee Detail 
function EmployeeDetail({ emp, onClose, onEdit, onDelete }) {
  const s = statusStyle[emp.status];
  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-900 font-display font-black text-xl">{emp.avatar}</span>
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">{emp.name}</h3>
          <p className="text-zinc-400 text-sm">{emp.position}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border mt-1.5 ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {statusLabel[emp.status]}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["Department", getDeptName(emp.departmentId)],
          ["Email",      emp.email],
          ["Phone",      emp.phone],
          ["Join Date",  emp.joinDate],
          ["Salary",     `$${emp.salary.toLocaleString()}`],
          ["Employee ID", `#${String(emp.id).padStart(4, "0")}`],
        ].map(([label, value]) => (
          <div key={label} className="bg-zinc-800 border border-zinc-700 px-4 py-3">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onEdit} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm transition-colors">Edit Employee</button>
        <button onClick={onDelete} className="flex-1 px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors">Delete Employee</button>
      </div>
    </div>
  );
}

// Delete Confirm
function DeleteConfirm({ emp, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-zinc-300 text-sm leading-relaxed">
        Are you sure you want to remove <span className="text-white font-semibold">{emp.name}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-display font-bold text-sm transition-colors">Delete →</button>
      </div>
    </div>
  );
}

// Employees Page
export default function Employees() {
  const [list, setList]   = useState(employees);
  const [modal, setModal] = useState(null); // null | { type, emp? }
  const [search, setSearch]   = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const refresh = () => setList([...employees]);

  const filtered = list.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.position.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || e.departmentId === Number(deptFilter);
    return matchSearch && matchDept;
  });

  const handleAdd = (data) => {
    const initials = data.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    employees = [...employees, { id: nextId++, avatar: initials, ...data }];
    refresh();
    setModal(null);
  };

  const handleEdit = (data) => {
    const initials = data.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    employees = employees.map((e) => e.id === modal.emp.id ? { ...e, avatar: initials, ...data } : e);
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    employees = employees.filter((e) => e.id !== modal.emp.id);
    refresh();
    setModal(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Management</p>
          <h1 className="font-display text-2xl font-bold text-white">Employees</h1>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
        >
          <span>+</span> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, position, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 sm:max-w-sm bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Summary strip */}
      <div className="fade-up grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",    value: list.length,                                        accent: "bg-amber-400" },
          { label: "Active",   value: list.filter((e) => e.status === "active").length,   accent: "bg-emerald-500" },
          { label: "On Leave", value: list.filter((e) => e.status === "on_leave").length, accent: "bg-zinc-500" },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Employee Table */}
      <div className="fade-up bg-zinc-900 border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
          <span className="col-span-3">Name</span>
          <span className="col-span-3">Position</span>
          <span className="col-span-2">Department</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-500 text-sm">No employees found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((emp, i) => {
              const s = statusStyle[emp.status];
              return (
                <div
                  key={emp.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors fade-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => setModal({ type: "detail", emp })}
                >
                  {/* Name + avatar */}
                  <div className="col-span-6 md:col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-400">
                      {emp.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{emp.name}</p>
                      <p className="text-zinc-500 text-xs truncate md:hidden">{emp.position}</p>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="hidden md:block col-span-3">
                    <p className="text-zinc-300 text-sm truncate">{emp.position}</p>
                  </div>

                  {/* Department */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-zinc-400 text-sm">{getDeptName(emp.departmentId)}</p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block col-span-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {statusLabel[emp.status]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-6 md:col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setModal({ type: "edit", emp })}
                      className="px-3 py-1.5 text-xs border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", emp })}
                      className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal title="Add Employee" onClose={() => setModal(null)} wide>
          <EmployeeForm onSave={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit Employee" onClose={() => setModal(null)} wide>
          <EmployeeForm initial={modal.emp} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "detail" && (
        <Modal title="Employee Detail" onClose={() => setModal(null)} wide>
          <EmployeeDetail
            emp={modal.emp}
            onClose={() => setModal(null)}
            onEdit={() => setModal({ type: "edit", emp: modal.emp })}
            onDelete={() => setModal({ type: "delete", emp: modal.emp })}
          />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Remove Employee" onClose={() => setModal(null)}>
          <DeleteConfirm emp={modal.emp} onConfirm={handleDelete} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </Layout>
  );
}