import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  // If already logged in, redirect immediately
  if (user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/my-profile"} replace />;
  }

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    try {
      register(form.name, form.email, form.password);
      // No navigate() — the if(user) check above handles redirect on re-render
    } catch (err) {
      setError(err.message);
    }
  };

  const fields = [
    { name: "name",     label: "Full Name",        type: "text",     placeholder: "Jane Smith" },
    { name: "email",    label: "Email",             type: "email",    placeholder: "you@company.com" },
    { name: "password", label: "Password",          type: "password", placeholder: "Min. 6 characters" },
    { name: "confirm",  label: "Confirm Password",  type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex font-body">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-14 relative overflow-hidden bg-zinc-900 border-r border-zinc-800">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-amber-400 rounded-full"
              style={{
                width: `${(i + 1) * 160}px`,
                height: `${(i + 1) * 160}px`,
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 flex items-center justify-center">
            <span className="text-zinc-900 font-display font-black text-base">H</span>
          </div>
          <span className="text-white font-display font-bold text-lg tracking-tight">HRCore</span>
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-1 mb-6 tracking-widest uppercase">
            New Account
          </div>
          <h1 className="font-display text-5xl font-bold text-white leading-[1.1] mb-5">
            Join your<br />
            <span className="text-amber-400">team today.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
            Create your employee account and get access to leave management, payroll records, and your profile.
          </p>
        </div>

        <div className="relative z-10 p-5 bg-zinc-800/50 border border-zinc-700">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">Note</p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            New accounts are assigned the <span className="text-white font-medium">Employee</span> role by default. Contact your admin to change permissions.
          </p>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center">
              <span className="text-zinc-900 font-display font-black text-sm">H</span>
            </div>
            <span className="text-white font-display font-bold text-base">HRCore</span>
          </div>

          <div className="fade-up fade-up-1 mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-1.5">Create account</h2>
            <p className="text-zinc-500 text-sm">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 fade-up fade-up-2">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
                {error}
              </p>
            )}

            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold py-3 text-sm tracking-wide transition-colors mt-2"
            >
              Create account →
            </button>
          </form>

          <p className="fade-up fade-up-3 text-zinc-500 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}