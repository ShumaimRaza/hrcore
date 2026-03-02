import { createContext, useContext, useState } from "react";
import { USERS } from "./data/mockData";

const AuthContext = createContext(null);

// Working copy so register() can push new users at runtime
const users = [...USERS];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return safeUser;
  };

  const register = (name, email, password) => {
    if (users.find((u) => u.email === email))
      throw new Error("Email already registered.");
    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const newUser = { id: Date.now(), name, email, role: "employee", avatar: initials };
    users.push({ ...newUser, password });
    setUser(newUser);
    return newUser;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}