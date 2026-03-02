import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Leave from "./pages/Leave";
import Salary from "./pages/Salary";
import MyProfile from "./pages/MyProfile";
import MyLeave from "./pages/MyLeave";
import MyPayslip from "./pages/MyPayslip";
import ChangePassword from "./pages/ChangePassword";
import EmployeeDashboard from "./pages/Employeedashboard";
import News from "./pages/News";
import MyAttendance from "./pages/Myattendance";
import AdminAttendance from "./pages/Adminattendance";
import Team from "./pages/Team";

const Placeholder = ({ label }) => (
  <Layout>
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-12 h-12 bg-amber-400 flex items-center justify-center mx-auto mb-4">
          <span className="text-zinc-900 font-black text-lg">H</span>
        </div>
        <p className="text-white font-display font-bold mb-1">{label}</p>
        <p className="text-zinc-500 text-sm">Coming soon</p>
      </div>
    </div>
  </Layout>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Shared (both roles) ── */}
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />

          {/* ── Employee routes ── */}
          <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/my-profile"      element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/my-leave"        element={<ProtectedRoute><MyLeave /></ProtectedRoute>} />
          <Route path="/my-payslip"      element={<ProtectedRoute><MyPayslip /></ProtectedRoute>} />
          <Route path="/my-attendance"   element={<ProtectedRoute><MyAttendance /></ProtectedRoute>} />
          <Route path="/team"            element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* ── Admin routes ── */}
          <Route path="/dashboard"        element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/departments"      element={<ProtectedRoute adminOnly><Departments /></ProtectedRoute>} />
          <Route path="/employees"        element={<ProtectedRoute adminOnly><Employees /></ProtectedRoute>} />
          <Route path="/leave"            element={<ProtectedRoute adminOnly><Leave /></ProtectedRoute>} />
          <Route path="/salary"           element={<ProtectedRoute adminOnly><Salary /></ProtectedRoute>} />
          <Route path="/admin-attendance" element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}