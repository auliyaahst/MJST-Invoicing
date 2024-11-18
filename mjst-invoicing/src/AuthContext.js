import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [fullname, setFullname] = useState(localStorage.getItem("fullname") || "");
  const [department, setDepartment] = useState(localStorage.getItem("department") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, username, fullname, department) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("fullname", fullname);
    localStorage.setItem("department", department);
    setIsAuthenticated(true);
    setUsername(username);
    setFullname(fullname);
    setDepartment(department);

    };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;