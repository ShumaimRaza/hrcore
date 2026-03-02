import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { EMPLOYEES, DEPARTMENTS } from "../data/mockData";

const statusStyle = {
  active:   { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  on_leave: { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20"     },
  inactive: { dot: "bg-zinc-500",    text: "text-zinc-400",    bg: "bg-zinc-700/30 border-zinc-700"           },
};
const statusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };

export default function MyProfile() {
  const { user } = useAuth();
  const emp = EMPLOYEES.find((e) => e.id === user?.employeeId);
  const dept = DEPARTMENTS.find((d) => d.id === emp?.departmentId);

  if (!emp) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 text-sm">No employee record linked to your account.</p>
        </div>
      </Layout>
    );
  }

  const s = statusStyle[emp.status];
  const yearsAtCompany = ((new Date() - new Date(emp.joinDate)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Employee</p>
        <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Hero card */}
        <div className="fade-up bg-zinc-900 border border-zinc-800 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-amber-400 flex items-center justify-center flex-shrink-0">
              <span className="text-zinc-900 font-display font-black text-2xl">{emp.avatar}</span>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-white mb-1">{emp.name}</h2>
              <p className="text-zinc-400 text-base mb-3">{emp.position}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {statusLabel[emp.status]}
                </span>
                <span className="text-zinc-500 text-xs">{dept?.name}</span>
                <span className="text-zinc-500 text-xs">·</span>
                <span className="text-zinc-500 text-xs">{yearsAtCompany} years at company</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="fade-up grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Email",        value: emp.email       },
            { label: "Phone",        value: emp.phone       },
            { label: "Department",   value: dept?.name ?? "—" },
            { label: "Position",     value: emp.position    },
            { label: "Join Date",    value: emp.joinDate    },
            { label: "Employee ID",  value: `#${String(emp.id).padStart(4, "0")}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 px-5 py-4">
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1.5">{label}</p>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Salary summary — read only */}
        <div className="fade-up bg-zinc-900 border border-zinc-800 px-5 py-4 flex items-center justify-between" style={{ animationDelay: "0.15s" }}>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Base Salary</p>
            <p className="font-display text-2xl font-bold text-amber-400">${emp.salary.toLocaleString()}</p>
          </div>
          <p className="text-zinc-600 text-xs text-right">per year<br />before deductions</p>
        </div>
      </div>
    </Layout>
  );
}