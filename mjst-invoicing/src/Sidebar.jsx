import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleInvoiceDropdown = () => {
    setIsInvoiceDropdownOpen(!isInvoiceDropdownOpen);
  };

  const toggleClientDropdown = () => {
    setIsClientDropdownOpen(!isClientDropdownOpen);
  };

  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Toggle Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out bg-white w-64 md:w-48 lg:w-48 xl:w-64 p-4 shadow-lg h-screen`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            Dashboard
          </Link>

          {/* Invoice Dropdown */}
          <div>
            <button
              onClick={toggleInvoiceDropdown}
              className="w-full flex items-center justify-between font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
            >
              <span>Invoice</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isInvoiceDropdownOpen
                  ? "rotate-180"
                  : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isInvoiceDropdownOpen &&
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  to="/input-invoice"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Create Invoice
                </Link>
                <Link
                  to="/invoice-list"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Invoice List
                </Link>
              </div>}
          </div>

          {/* Client Dropdown */}
          <div>
            <button
              onClick={toggleClientDropdown}
              className="w-full flex items-center justify-between font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
            >
              <span>Client</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isClientDropdownOpen
                  ? "rotate-180"
                  : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isClientDropdownOpen &&
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  to="/input-client"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Input Client
                </Link>
                <Link
                  to="/client-list"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Client List
                </Link>
              </div>}
          </div>

          {/* Order Dropdown */}
          {/* <div>
            <button
              onClick={toggleOrderDropdown}
              className="w-full flex items-center justify-between font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
            >
              <span>Order</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isOrderDropdownOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOrderDropdownOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  to="/input-order"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Input Order
                </Link>
                <Link
                  to="/order-list"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Order List
                </Link>
              </div>
            )}
          </div> */}

          {/*Manage User Dropdown*/}
          <div>
            <button
              onClick={toggleUserDropdown}
              className="w-full flex items-center justify-between font-medium text-left text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
            >
              <span>Management User</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isUserDropdownOpen
                  ? "rotate-180"
                  : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isUserDropdownOpen &&
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  to="/create-user"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Create New User
                </Link>

                <Link
                  to="/user-list"
                  className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  User List
                </Link>
              </div>}
          </div>

          {/* Settings */}
          <Link
            to="/settings"
            className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            Settings
          </Link>
          <Link
            to="/"
            className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            Logout
          </Link>
        </div>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen &&
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />}
    </div>
  );
};

export default Sidebar;
