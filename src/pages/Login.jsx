import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // If already logged in, redirect immediately during render — no race condition
  if (user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/employee-dashboard"} replace />;
  }

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      // No navigate() here — the if(user) check above handles redirect on re-render
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex font-body">
      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center p-14 relative overflow-hidden bg-zinc-900 border-r border-zinc-800">
        {/* Geometric background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-amber-400 rounded-full"
              style={{
                width: `${(i + 1) * 160}px`,
                height: `${(i + 1) * 160}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />

        {/* Logo — pinned to top */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-14 h-16 border-b border-zinc-800">
          <div className="w-9 h-9 bg-amber-400 flex items-center justify-center">
            <span className="text-zinc-900 font-display font-black text-base">H</span>
          </div>
          <span className="text-white font-display font-bold text-lg tracking-tight">HRCore</span>
        </div>

        {/* Hero text — vertically centered */}
        <div className="relative z-10">
          <div className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-1 mb-6 tracking-widest uppercase">
            People Operations Platform
          </div>
          <h1 className="font-display text-5xl font-bold text-white leading-[1.1] mb-5">
            Your team.<br />
            <span className="text-amber-400">Managed.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
            Streamline hiring, payroll, leave management, and HR operations — all in one place.
          </p>
        </div>


      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center">
              <span className="text-zinc-900 font-display font-black text-sm">H</span>
            </div>
            <span className="text-white font-display font-bold text-base">HRCore</span>
          </div>

          <div className="fade-up fade-up-1 mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-1.5">Sign in</h2>
            <p className="text-zinc-500 text-sm">Enter your credentials to access the platform.</p>
          </div>

          {/* Demo hint */}
          <div className="fade-up fade-up-2 mb-6 p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <p className="text-zinc-300 font-medium mb-1.5">Demo accounts</p>
            <p>Admin: <span className="text-amber-400">admin@hr.com</span> / admin123</p>
            <p>Employee: <span className="text-amber-400">shumaim@hr.com</span> / shumaim123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 fade-up fade-up-3">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-display font-bold py-3 text-sm tracking-wide transition-colors mt-2"
            >
              Sign in →
            </button>
          </form>

          <p className="fade-up fade-up-4 text-zinc-500 text-sm mt-6 text-center">
            No account?{" "}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}