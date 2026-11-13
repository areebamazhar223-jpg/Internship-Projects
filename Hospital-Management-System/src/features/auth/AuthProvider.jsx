import { useState } from "react";
import AuthContext from "./AuthContext";
import {
  readStoredValue,
  removeStoredValue,
  writeStoredValue,
} from "../../lib/storage";

const demoUsers = [
  {
    id: 1,
    name: "Hospital Admin",
    email: "admin@hospital.com",
    password: "123456",
    role: "Admin",
  },
  {
    id: 2,
    name: "Dr. Ali Hassan",
    email: "doctor@hospital.com",
    password: "123456",
    role: "Doctor",
  },
  {
    id: 3,
    name: "Reception Staff",
    email: "reception@hospital.com",
    password: "123456",
    role: "Receptionist",
  },
];

const isStoredUser = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  typeof value.id === "number" &&
  typeof value.name === "string" &&
  typeof value.email === "string" &&
  demoUsers.some((demoUser) => demoUser.role === value.role);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    readStoredValue("hospitalUser", null, isStoredUser),
  );

  const login = (email, password) => {
    const matchedUser = demoUsers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const loggedInUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    writeStoredValue("hospitalUser", loggedInUser);
    setUser(loggedInUser);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    removeStoredValue("hospitalUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
