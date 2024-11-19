// App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AuthContext from "./AuthContext";
import InputClient from "./InputClient";
import ClientList from "./ClientList";
import InputOrder from "./InputOrder";
import Settings from "./Settings";
import "./index.css";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const showBar = isAuthenticated && location.pathname !== "/" && location.pathname !== "/register";

  return (
    <>
      {showBar && <Navbar />}
      <div className="flex">
        {showBar && <Sidebar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/input-client" element={<InputClient />} />
            <Route path="/client-list" element={<ClientList />} />
            <Route path="/input-order" element={<InputOrder />} /> 
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;