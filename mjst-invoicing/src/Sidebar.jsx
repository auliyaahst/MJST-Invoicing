import React, { useState } from "react";

const Sidebar = () => {
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] = useState(false);
	const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const toggleInvoiceDropdown = () => {
    setIsInvoiceDropdownOpen(!isInvoiceDropdownOpen);
  };

	const toggleClientDropdown = () => {
		setIsClientDropdownOpen(!isClientDropdownOpen);
	}
  
  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  }


  return (
    <div className="bg-white w-64 flex flex-col border-r border-gray-200 h-screen">
      <div className="flex flex-col h-full px-4 py-5 space-y-4">
        {/* Dashboard Link */}
        <a
          href="/dashboard"
          className="flex items-center font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          <svg
            className="w-5 h-5 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </a>

        {/* About Link */}
        <a
          href="#"
          className="flex items-center font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          About
        </a>

        {/* Invoice Dropdown */}
        <div>
          <button
            onClick={toggleInvoiceDropdown}
            className="w-full flex items-center justify-between font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            <span>Invoice</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isInvoiceDropdownOpen ? "rotate-180" : ""
              }`}
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

          {/* Dropdown Menu */}
          {isInvoiceDropdownOpen && (
            <div className="ml-4 mt-2 space-y-2">
              <a
                href="/create-invoice"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Create Invoice
              </a>
              <a
                href="/invoices"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Invoice List
              </a>
            </div>
          )}
        </div>

				{/* Invoice Dropdown */}
        <div>
          <button
            onClick={toggleClientDropdown}
            className="w-full flex items-center justify-between font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
          >
            <span>Client</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isClientDropdownOpen ? "rotate-180" : ""
              }`}
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

          {/* Dropdown Menu */}
          {isClientDropdownOpen && (
            <div className="ml-4 mt-2 space-y-2">
              <a
                href="/input-client"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Input Client
              </a>
              <a
                href="/client-list"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Client List
              </a>
            </div>
          )}
        </div>

        {/* Order Dropdown */}
        <div>
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

          {/* Dropdown Menu */}
          {isOrderDropdownOpen && (
            <div className="ml-4 mt-2 space-y-2">
              <a
                href="/input-order"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Input Order
              </a>
              <a
                href="/order-list"
                className="block font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                Order List
              </a>
            </div>
          )}
        </div>



        {/* Settings */}
        <a
          href="/settings"
          className="flex items-center font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          Settings
        </a>
        <a
          href="/"
          className="flex items-center font-medium text-gray-900 hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          Logout
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
