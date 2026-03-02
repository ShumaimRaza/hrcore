import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ADMIN_NAV = [
  { to: "/dashboard",        label: "Dashboard",   icon: "▦" },
  { to: "/departments",      label: "Departments", icon: "⊞" },
  { to: "/employees",        label: "Employees",   icon: "◎" },
  { to: "/leave",            label: "Leave",       icon: "◷" },
  { to: "/salary",           label: "Salary",      icon: "◈" },
  { to: "/admin-attendance", label: "Attendance",  icon: "◉" },
  { to: "/news",             label: "News",        icon: "▤" },
];

const EMPLOYEE_NAV = [
  { to: "/employee-dashboard", label: "Dashboard",  icon: "▦" },
  { to: "/my-profile",         label: "My Profile", icon: "◎" },
  { to: "/my-leave",           label: "My Leave",   icon: "◷" },
  { to: "/my-payslip",         label: "My Payslip", icon: "◈" },
  { to: "/my-attendance",      label: "Attendance", icon: "◉" },
  { to: "/team",               label: "My Team",    icon: "⊞" },
  { to: "/news",               label: "News",       icon: "▤" },
  { to: "/change-password",    label: "Password",   icon: "⊙" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // On mobile: sidebarOpen controls slide-over. On desktop: collapsed controls width.
  const [collapsed, setCollapsed]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleNavClick = () => setSidebarOpen(false); // close drawer on mobile nav

  const SidebarContent = ({ slim }) => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-zinc-800 flex-shrink-0 ${slim ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-900 font-display font-black text-sm">H</span>
        </div>
        {!slim && <span className="text-white font-display font-bold text-base tracking-tight">HRCore</span>}
      </div>

      {/* Role badge */}
      {!slim && (
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <span className={`text-xs font-semibold uppercase tracking-widest px-2 py-1 ${
            user?.role === "admin"
              ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
              : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
          }`}>
            {user?.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm ${
                isActive ? "bg-amber-400 text-zinc-900 font-semibold" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              } ${slim ? "justify-center" : ""}`
            }
          >
            <span className="text-base leading-none flex-shrink-0">{icon}</span>
            {!slim && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-zinc-800 flex-shrink-0">
        {!slim && (
          <div className="px-3 py-2">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-zinc-500 text-xs capitalize">{user?.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-sm transition-colors ${slim ? "justify-center" : ""}`}
        >
          <span className="text-base leading-none">⎋</span>
          {!slim && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex font-body">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile slide-over sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:hidden
      `}>
        <SidebarContent slim={false} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col flex-shrink-0
        ${collapsed ? "w-16" : "w-56"}
        bg-zinc-900 border-r border-zinc-800
        transition-all duration-200
      `}>
        <SidebarContent slim={collapsed} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0">
          {/* Mobile: hamburger opens drawer. Desktop: toggles collapse */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setSidebarOpen((o) => !o);
              else setCollapsed((c) => !c);
            }}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-sm transition-colors text-lg"
          >
            ☰
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center text-zinc-900 font-display font-bold text-xs flex-shrink-0">
              {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-zinc-300 text-sm hidden sm:block truncate max-w-[140px]">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}