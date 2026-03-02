import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../AuthContext";
import { USERS } from "../data/mockData";

// Working copy for runtime password changes
const users = USERS;

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm]     = useState({ current: "", newPass: "", confirm: "" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userRecord = users.find((u) => u.id === user?.id);
    if (!userRecord) return setError("User not found.");
    if (form.current !== userRecord.password) return setError("Current password is incorrect.");
    if (form.newPass.length < 6) return setError("New password must be at least 6 characters.");
    if (form.newPass !== form.confirm) return setError("New passwords do not match.");
    if (form.newPass === form.current) return setError("New password must be different from current password.");

    setLoading(true);
    // Simulate async update
    setTimeout(() => {
      userRecord.password = form.newPass;
      setForm({ current: "", newPass: "", confirm: "" });
      setSuccess("Password updated successfully!");
      setLoading(false);
      setTimeout(() => setSuccess(""), 5000);
    }, 600);
  };

  const requirements = [
    { label: "At least 6 characters",           met: form.newPass.length >= 6 },
    { label: "Different from current password",  met: form.newPass !== form.current && form.newPass.length > 0 },
    { label: "Passwords match",                  met: form.newPass === form.confirm && form.confirm.length > 0 },
  ];

  return (
    <Layout>
      <div className="fade-up mb-8">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Account</p>
        <h1 className="font-display text-2xl font-bold text-white">Change Password</h1>
      </div>

      <div className="max-w-md space-y-6">
        {/* Info card */}
        <div className="fade-up bg-zinc-900 border border-zinc-800 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-400 flex items-center justify-center flex-shrink-0">
            <span className="text-zinc-900 font-display font-black text-sm">{user?.avatar}</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-zinc-500 text-xs">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="fade-up bg-zinc-900 border border-zinc-800 p-6 space-y-5" style={{ animationDelay: "0.1s" }}>
          {error   && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}
          {success && <p className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 px-4 py-3">{success}</p>}

          {[
            { key: "current", label: "Current Password",     placeholder: "Enter current password" },
            { key: "newPass", label: "New Password",          placeholder: "Min. 6 characters"      },
            { key: "confirm", label: "Confirm New Password",  placeholder: "Repeat new password"    },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
              <input
                type="password"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                required
                className={inputCls}
              />
            </div>
          ))}

          {/* Requirements checklist */}
          {(form.newPass.length > 0 || form.confirm.length > 0) && (
            <div className="space-y-1.5 pt-1">
              {requirements.map(({ label, met }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${met ? "text-emerald-400" : "text-zinc-600"}`}>
                    {met ? "✓" : "○"}
                  </span>
                  <span className={`text-xs ${met ? "text-zinc-300" : "text-zinc-600"}`}>{label}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !requirements.every((r) => r.met)}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-display font-bold py-3 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Update Password →"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}