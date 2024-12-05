import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [fullname, setFullname] = useState(localStorage.getItem("fullname") || "");
  const [department, setDepartment] = useState(localStorage.getItem("department") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry) {
      const timeLeft = new Date(tokenExpiry) - new Date();
      if (timeLeft > 0) {
        setIsAuthenticated(true);
        const timeout = setTimeout(() => {
          handleSessionExpiry();
        }, timeLeft);
        return () => clearTimeout(timeout);
      } else {
        handleSessionExpiry();
      }
    }
  }, []);

  const login = (token, username, fullname, department, expiryTimeInMinutes = 60) => {
    const tokenExpiry = new Date(new Date().getTime() + expiryTimeInMinutes * 60000);
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", tokenExpiry);
    localStorage.setItem("username", username);
    localStorage.setItem("fullname", fullname);
    localStorage.setItem("department", department);
    setIsAuthenticated(true);
    setUsername(username);
    setFullname(fullname);
    setDepartment(department);

    const timeout = setTimeout(() => {
      handleSessionExpiry();
    }, expiryTimeInMinutes * 60000);
    return () => clearTimeout(timeout);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    localStorage.removeItem("department");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const handleSessionExpiry = () => {
    toast.error("Session expired. Please log in again.");
    logout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;