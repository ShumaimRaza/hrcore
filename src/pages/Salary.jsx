import { useState } from "react";
import Layout from "../components/Layout";
import { SALARY_RECORDS, EMPLOYEES } from "../data/mockData";

//  Runtime state 
let salaryRecords = [...SALARY_RECORDS];
let nextId = Math.max(...SALARY_RECORDS.map((s) => s.id)) + 1;

//  Helpers 
const getEmployee = (id) => EMPLOYEES.find((e) => e.id === id);
const fmt = (n) => `$${Number(n).toLocaleString()}`;
const MONTHS = [
  "2024-01","2024-02","2024-03","2024-04",
  "2024-05","2024-06","2024-07","2024-08",
  "2024-09","2024-10","2024-11","2024-12",
];
const fmtMonth = (m) => {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleString("default", { month: "long", year: "numeric" });
};

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

//  Salary Form 
function SalaryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    employeeId:  initial?.employeeId  ?? EMPLOYEES[0]?.id ?? 1,
    month:       initial?.month       ?? "2024-01",
    baseSalary:  initial?.baseSalary  ?? "",
    bonus:       initial?.bonus       ?? "",
    deductions:  initial?.deductions  ?? "",
  });
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const base   = parseFloat(form.baseSalary)  || 0;
  const bonus  = parseFloat(form.bonus)       || 0;
  const deduct = parseFloat(form.deductions)  || 0;
  const total  = base + bonus - deduct;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.baseSalary) return setError("Base salary is required.");
    if (base <= 0)        return setError("Base salary must be greater than 0.");
    onSave({
      ...form,
      employeeId: Number(form.employeeId),
      baseSalary: base,
      bonus,
      deductions: deduct,
      total,
    });
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
        <select className={inputCls} value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} disabled={!!initial}>
          {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </Field>

      <Field label="Month">
        <select className={inputCls} value={form.month} onChange={(e) => set("month", e.target.value)} disabled={!!initial}>
          {MONTHS.map((m) => <option key={m} value={m}>{fmtMonth(m)}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-4">
        <Field label="Base Salary (USD)">
          <input type="number" min="0" className={inputCls} value={form.baseSalary} onChange={(e) => set("baseSalary", e.target.value)} placeholder="75000" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Bonus (USD)">
            <input type="number" min="0" className={inputCls} value={form.bonus} onChange={(e) => set("bonus", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Deductions (USD)">
            <input type="number" min="0" className={inputCls} value={form.deductions} onChange={(e) => set("deductions", e.target.value)} placeholder="0" />
          </Field>
        </div>
      </div>

      {/* Live total calculation */}
      <div className="bg-zinc-800 border border-zinc-700 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Base Salary</span>
          <span className="text-white">{fmt(base)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">+ Bonus</span>
          <span className="text-emerald-400">+{fmt(bonus)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">− Deductions</span>
          <span className="text-red-400">−{fmt(deduct)}</span>
        </div>
        <div className="border-t border-zinc-700 pt-2 flex justify-between">
          <span className="text-zinc-300 font-semibold text-sm uppercase tracking-widest">Net Total</span>
          <span className="font-display font-bold text-amber-400 text-lg">{fmt(total)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold text-sm transition-colors">
          {initial ? "Save Changes" : "Add Record"} →
        </button>
      </div>
    </form>
  );
}

//  Salary Detail Modal 
function SalaryDetail({ record, onClose, onEdit, onDelete }) {
  const emp = getEmployee(record.employeeId);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-900 font-display font-black text-sm">{emp?.avatar}</span>
        </div>
        <div>
          <p className="text-white font-display font-bold">{emp?.name}</p>
          <p className="text-zinc-400 text-sm">{emp?.position}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Month</p>
          <p className="text-white font-semibold text-sm">{fmtMonth(record.month)}</p>
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 p-4 space-y-3">
        {[
          { label: "Base Salary",  value: fmt(record.baseSalary),  color: "text-white"        },
          { label: "+ Bonus",      value: `+${fmt(record.bonus)}`, color: "text-emerald-400"  },
          { label: "− Deductions", value: `-${fmt(record.deductions)}`, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between items-center text-sm border-b border-zinc-700 pb-3 last:border-0 last:pb-0">
            <span className="text-zinc-400">{label}</span>
            <span className={`font-medium ${color}`}>{value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1">
          <span className="text-zinc-300 font-semibold uppercase tracking-widest text-xs">Net Total</span>
          <span className="font-display font-bold text-amber-400 text-2xl">{fmt(record.total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onEdit}   className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm transition-colors">Edit Record</button>
        <button onClick={onDelete} className="flex-1 px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors">Delete Record</button>
      </div>
    </div>
  );
}

//  Delete Confirm 
function DeleteConfirm({ record, onConfirm, onCancel }) {
  const emp = getEmployee(record.employeeId);
  return (
    <div className="space-y-4">
      <p className="text-zinc-300 text-sm leading-relaxed">
        Delete salary record for <span className="text-white font-semibold">{emp?.name}</span> — <span className="text-amber-400">{fmtMonth(record.month)}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel}  className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-display font-bold text-sm transition-colors">Delete →</button>
      </div>
    </div>
  );
}

//  Salary Records Page 
export default function Salary() {
  const [list, setList]       = useState(salaryRecords);
  const [modal, setModal]     = useState(null);
  const [monthFilter, setMonthFilter] = useState("all");
  const [search, setSearch]   = useState("");

  const refresh = () => setList([...salaryRecords]);

  const filtered = list.filter((r) => {
    const emp = getEmployee(r.employeeId);
    const matchSearch = emp?.name.toLowerCase().includes(search.toLowerCase());
    const matchMonth  = monthFilter === "all" || r.month === monthFilter;
    return matchSearch && matchMonth;
  });

  const handleAdd = (data) => {
    // Prevent duplicate record for same employee + month
    const exists = salaryRecords.find((r) => r.employeeId === data.employeeId && r.month === data.month);
    if (exists) return alert("A record for this employee and month already exists.");
    salaryRecords = [...salaryRecords, { id: nextId++, ...data }];
    refresh();
    setModal(null);
  };

  const handleEdit = (data) => {
    salaryRecords = salaryRecords.map((r) => r.id === modal.record.id ? { ...r, ...data } : r);
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    salaryRecords = salaryRecords.filter((r) => r.id !== modal.record.id);
    refresh();
    setModal(null);
  };

  // Summary stats for filtered month
  const summaryList = monthFilter === "all" ? list : filtered;
  const totalPayroll   = summaryList.reduce((s, r) => s + r.total, 0);
  const totalBonus     = summaryList.reduce((s, r) => s + r.bonus, 0);
  const totalDeductions = summaryList.reduce((s, r) => s + r.deductions, 0);
  const avgSalary      = summaryList.length ? Math.round(summaryList.reduce((s, r) => s + r.total, 0) / summaryList.length) : 0;

  return (
    <Layout>
      {/* Header */}
      <div className="fade-up flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Management</p>
          <h1 className="font-display text-2xl font-bold text-white">Salary Records</h1>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold px-4 py-2.5 text-sm transition-colors"
        >
          <span>+</span> Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Payroll",   value: fmt(totalPayroll),    accent: "bg-amber-400"   },
          { label: "Total Bonuses",   value: fmt(totalBonus),      accent: "bg-emerald-500" },
          { label: "Total Deductions",value: fmt(totalDeductions), accent: "bg-red-500"     },
          { label: "Avg Net Salary",  value: fmt(avgSalary),       accent: "bg-cyan-500"    },
        ].map(({ label, value, accent }, i) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
            <p className="font-display text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 sm:min-w-48 sm:max-w-sm bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">All Months</option>
          {MONTHS.map((m) => <option key={m} value={m}>{fmtMonth(m)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="fade-up bg-zinc-900 border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
          <span className="col-span-3">Employee</span>
          <span className="col-span-2">Month</span>
          <span className="col-span-2">Base</span>
          <span className="col-span-1">Bonus</span>
          <span className="col-span-2">Deductions</span>
          <span className="col-span-1">Net</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-500 text-sm">No salary records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((record, i) => {
              const emp = getEmployee(record.employeeId);
              return (
                <div
                  key={record.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/40 transition-colors cursor-pointer fade-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => setModal({ type: "detail", record })}
                >
                  {/* Employee */}
                  <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                      {emp?.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{emp?.name}</p>
                      <p className="text-zinc-500 text-xs md:hidden">{fmtMonth(record.month)}</p>
                    </div>
                  </div>

                  {/* Month */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-zinc-400 text-sm">{fmtMonth(record.month)}</p>
                  </div>

                  {/* Base */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-zinc-300 text-sm">{fmt(record.baseSalary)}</p>
                  </div>

                  {/* Bonus */}
                  <div className="hidden md:block col-span-1">
                    <p className="text-emerald-400 text-sm">+{fmt(record.bonus)}</p>
                  </div>

                  {/* Deductions */}
                  <div className="hidden md:block col-span-2">
                    <p className="text-red-400 text-sm">-{fmt(record.deductions)}</p>
                  </div>

                  {/* Net total */}
                  <div className="hidden md:block col-span-1">
                    <p className="text-amber-400 font-display font-bold text-sm">{fmt(record.total)}</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-5 md:col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setModal({ type: "edit", record })}
                      className="px-2.5 py-1.5 text-xs border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                    >Edit</button>
                    <button
                      onClick={() => setModal({ type: "delete", record })}
                      className="px-2.5 py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >Del</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal title="Add Salary Record" onClose={() => setModal(null)} wide>
          <SalaryForm onSave={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit Salary Record" onClose={() => setModal(null)} wide>
          <SalaryForm initial={modal.record} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "detail" && (
        <Modal title="Salary Detail" onClose={() => setModal(null)} wide>
          <SalaryDetail
            record={modal.record}
            onClose={() => setModal(null)}
            onEdit={() => setModal({ type: "edit", record: modal.record })}
            onDelete={() => setModal({ type: "delete", record: modal.record })}
          />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Delete Record" onClose={() => setModal(null)}>
          <DeleteConfirm record={modal.record} onConfirm={handleDelete} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </Layout>
  );
}