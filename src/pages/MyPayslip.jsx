import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { SALARY_RECORDS, EMPLOYEES } from "../data/mockData";

const fmt = (n) => `$${Number(n).toLocaleString()}`;
const fmtMonth = (m) => {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleString("default", { month: "long", year: "numeric" });
};

export default function MyPayslip() {
  const { user } = useAuth();
  const emp = EMPLOYEES.find((e) => e.id === user?.employeeId);
  const myRecords = SALARY_RECORDS.filter((r) => r.employeeId === user?.employeeId)
    .sort((a, b) => b.month.localeCompare(a.month));

  const [selected, setSelected] = useState(myRecords[0] ?? null);

  if (!emp || myRecords.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 text-sm">No payslip records found for your account.</p>
        </div>
      </Layout>
    );
  }

  const totalEarned = myRecords.reduce((s, r) => s + r.total, 0);
  const avgNet      = Math.round(totalEarned / myRecords.length);

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Employee</p>
        <h1 className="font-display text-2xl font-bold text-white">My Payslip</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Summary cards */}
        <div className="fade-up grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Earned",   value: fmt(totalEarned), accent: "bg-amber-400"   },
            { label: "Avg Net / Month",value: fmt(avgNet),      accent: "bg-emerald-500" },
            { label: "Payslips",       value: myRecords.length, accent: "bg-cyan-500"    },
          ].map(({ label, value, accent }, i) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
              <p className="font-display text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="fade-up grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ animationDelay: "0.15s" }}>
          {/* Month selector */}
          <div className="sm:col-span-1 bg-zinc-900 border border-zinc-800">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Select Month</p>
            </div>
            <div className="divide-y divide-zinc-800">
              {myRecords.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selected?.id === r.id
                      ? "bg-amber-400 text-zinc-900 font-semibold"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {fmtMonth(r.month)}
                </button>
              ))}
            </div>
          </div>

          {/* Payslip detail */}
          {selected && (
            <div className="sm:col-span-2 bg-zinc-900 border border-zinc-800">
              {/* Header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Payslip</p>
                  <p className="font-display text-white font-bold text-lg">{fmtMonth(selected.month)}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs mb-1">{emp.name}</p>
                  <p className="text-zinc-500 text-xs">{emp.position}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-6 space-y-4">
                {/* Earnings */}
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3 font-semibold">Earnings</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Base Salary</span>
                      <span className="text-white font-medium">{fmt(selected.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Bonus</span>
                      <span className="text-emerald-400 font-medium">+ {fmt(selected.bonus)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800" />

                {/* Deductions */}
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3 font-semibold">Deductions</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Total Deductions</span>
                    <span className="text-red-400 font-medium">− {fmt(selected.deductions)}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800" />

                {/* Net total */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-300 font-semibold uppercase tracking-widest text-xs">Net Pay</span>
                  <span className="font-display font-bold text-amber-400 text-3xl">{fmt(selected.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}