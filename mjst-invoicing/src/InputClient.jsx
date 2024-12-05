import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputClient = () => {
  const [clientData, setClientData] = useState({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    clientPIC: "",
    clientPICTitle: "",
    businessSector: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/clients", clientData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Client created successfully!");
      setClientData({
        clientName: "",
        clientAddress: "",
        clientPhone: "",
        clientEmail: "",
        clientPIC: "",
        clientPICTitle: "",
        businessSector: ""
      });
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
          Create Client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name:
              </label>
              <input
                type="text"
                name="clientName"
                value={clientData.clientName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Address:
              </label>
              <textarea
                name="clientAddress"
                value={clientData.clientAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Phone:
              </label>
              <input
                type="text"
                name="clientPhone"
                value={clientData.clientPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Email:
              </label>
              <input
                type="email"
                name="clientEmail"
                value={clientData.clientEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client PIC:
              </label>
              <input
                type="text"
                name="clientPIC"
                value={clientData.clientPIC}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client PIC Title:
              </label>
              <input
                type="text"
                name="clientPICTitle"
                value={clientData.clientPICTitle}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Sector:
              </label>
              <input
                type="text"
                name="businessSector"
                value={clientData.businessSector}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Client
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default InputClient;