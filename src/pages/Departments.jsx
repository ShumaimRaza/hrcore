import { useState } from "react";
import Layout from "../components/Layout";
import { DEPARTMENTS, EMPLOYEES } from "../data/mockData";

// Runtime state 
let deptList = [...DEPARTMENTS];
let nextId = Math.max(...DEPARTMENTS.map((d) => d.id)) + 1;

// Modal 
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 w-full max-w-md fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Dept Form
function DeptForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:      initial?.name      ?? "",
    headCount: initial?.headCount ?? "",
  });
  const [error, setError] = useState("");

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    onSave({ name: form.name.trim(), headCount: Number(form.headCount) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Department Name</label>
        <input className={inputCls} value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Engineering" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Head Count</label>
        <input type="number" className={inputCls} value={form.headCount} onChange={(e) => setForm(p => ({ ...p, headCount: e.target.value }))} placeholder="0" min="0" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">
          {initial ? "Save Changes" : "Add Department"} →
        </button>
      </div>
    </form>
  );
}

// Departments Page
export default function Departments() {
  const [list, setList]   = useState(deptList);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const refresh = () => setList([...deptList]);

  const filtered  = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const totalHeads = list.reduce((s, d) => s + (d.headCount || 0), 0);

  const handleAdd = (data) => {
    deptList = [...deptList, { id: nextId++, managerId: null, ...data }];
    refresh(); setModal(null);
  };

  const handleEdit = (data) => {
    deptList = deptList.map((d) => d.id === modal.dept.id ? { ...d, ...data } : d);
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    deptList = deptList.filter((d) => d.id !== modal.dept.id);
    refresh(); setModal(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Management</p>
          <h1 className="font-display text-2xl font-bold text-white">Departments</h1>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
        >
          <span>+</span> Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="fade-up grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Departments", value: list.length,      accent: "bg-amber-400"   },
          { label: "Total Headcount",   value: totalHeads,       accent: "bg-emerald-500" },
          { label: "Avg Team Size",     value: list.length ? Math.round(totalHeads / list.length) : 0, accent: "bg-cyan-500" },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="fade-up mb-6">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="fade-up bg-zinc-900 border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            {filtered.length} department{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
          <span className="col-span-5">Name</span>
          <span className="col-span-3">Employees</span>
          <span className="col-span-2">Head Count</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-500 text-sm">No departments found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((dept, i) => {
              const empCount = EMPLOYEES.filter((e) => e.departmentId === dept.id).length;
              return (
                <div
                  key={dept.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors fade-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="col-span-8 md:col-span-5">
                    <p className="text-white text-sm font-medium">{dept.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 md:hidden">{empCount} employees</p>
                  </div>
                  <div className="hidden md:block col-span-3">
                    <p className="text-zinc-400 text-sm">{empCount}</p>
                  </div>
                  <div className="hidden md:block col-span-2">
                    <p className="text-zinc-400 text-sm">{dept.headCount}</p>
                  </div>
                  <div className="col-span-4 md:col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => setModal({ type: "edit", dept })}
                      className="px-3 py-1.5 text-xs border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                    >Edit</button>
                    <button
                      onClick={() => setModal({ type: "delete", dept })}
                      className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal title="Add Department" onClose={() => setModal(null)}>
          <DeptForm onSave={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit Department" onClose={() => setModal(null)}>
          <DeptForm initial={modal.dept} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Delete Department" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-zinc-300 text-sm">
              Delete <span className="text-white font-semibold">{modal.dept.name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-display font-bold text-sm transition-colors">Delete →</button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}