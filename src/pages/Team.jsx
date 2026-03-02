import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { EMPLOYEES, DEPARTMENTS } from "../data/mockData";

const statusStyle = {
  active:   { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  on_leave: { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20"     },
  inactive: { dot: "bg-zinc-500",    text: "text-zinc-400",    bg: "bg-zinc-700/30 border-zinc-700"           },
};
const statusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };

export default function Team() {
  const { user } = useAuth();
  const me = EMPLOYEES.find((e) => e.id === user?.employeeId);
  const dept = DEPARTMENTS.find((d) => d.id === me?.departmentId);
  const teammates = EMPLOYEES.filter((e) => e.departmentId === me?.departmentId);

  if (!me) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 text-sm">No employee record linked to your account.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Employee</p>
        <h1 className="font-display text-2xl font-bold text-white">My Team</h1>
      </div>

      {/* Department hero */}
      <div className="fade-up bg-zinc-900 border border-zinc-800 p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Department</p>
            <h2 className="font-display text-2xl font-bold text-white">{dept?.name}</h2>
            <p className="text-zinc-400 text-sm mt-1">{teammates.length} member{teammates.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Active</p>
            <p className="font-display text-3xl font-bold text-amber-400">
              {teammates.filter((e) => e.status === "active").length}
            </p>
          </div>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teammates.map((emp, i) => {
          const s = statusStyle[emp.status];
          const isMe = emp.id === me.id;
          return (
            <div
              key={emp.id}
              className={`fade-up bg-zinc-900 border p-5 relative overflow-hidden transition-colors ${
                isMe ? "border-amber-400/40" : "border-zinc-800 hover:border-zinc-700"
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {isMe && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5">You</span>
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isMe ? "bg-amber-400" : "bg-zinc-800 border border-zinc-700"}`}>
                  <span className={`font-display font-black text-sm ${isMe ? "text-zinc-900" : "text-amber-400"}`}>{emp.avatar}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-display font-bold text-sm truncate">{emp.name}</p>
                  <p className="text-zinc-400 text-xs truncate mt-0.5">{emp.position}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Email</span>
                  <span className="text-zinc-300 truncate ml-2">{emp.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Phone</span>
                  <span className="text-zinc-300">{emp.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Joined</span>
                  <span className="text-zinc-300">{emp.joinDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {statusLabel[emp.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}