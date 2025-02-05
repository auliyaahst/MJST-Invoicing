import React, { useState, useEffect } from "react";
import Logo from "./assets/mjst png.png";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const updateUsername = () => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);

      const storedFullname = localStorage.getItem("fullname");
      if (storedFullname) setFullname(storedFullname);

      const storedDepartment = localStorage.getItem("department");
      if (storedDepartment) setDepartment(storedDepartment);
    };

    updateUsername();
    window.addEventListener("storage", updateUsername);
    return () => window.removeEventListener("storage", updateUsername);
  }, []);

  return (
    <div className="navbar bg-white border-b-2 border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} className="h-8 w-auto" alt="Logo" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <p className="font-semibold text-sm">
              {fullname ? `${fullname} (${department})` : "Profile username"}
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-200">
          <div className="p-4 space-y-4">
            <button className="block w-full text-left text-gray-700">
              {fullname ? `${fullname} (${department})` : "Profile username"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
