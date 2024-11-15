import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const InputClient = () => {
  const [clientData, setClientData] = useState({
    clientName: "",
    clientAddress: "",
    clientProvince: "",
    clientZipCode: "",
    clientPhone: "",
    clientPIC: "",
    clientPICTitle: "",
    businessSector: "",
  });

  const [notification, setNotification] = useState("");
  const { isAuthenticated, username } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/clients",
        clientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Client created:", response.data);
      setNotification("Client successfully added!");
      setTimeout(() => {
        setNotification("");
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error creating client:", error);
      setNotification("Error creating client. Please try again.");
      setTimeout(() => {
        setNotification("");
      }, 1000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Create Client</h1>
        {notification && (
          <div className="p-4 mb-4 text-center text-white bg-green-500 rounded">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name:</label>
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
            <label className="block text-sm font-medium text-gray-700">Client Address:</label>
            <input
              type="text"
              name="clientAddress"
              value={clientData.clientAddress}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Province:</label>
            <input
              type="text"
              name="clientProvince"
              value={clientData.clientProvince}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Zip Code:</label>
            <input
              type="text"
              name="clientZipCode"
              value={clientData.clientZipCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Phone:</label>
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
            <label className="block text-sm font-medium text-gray-700">Client PIC:</label>
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
            <label className="block text-sm font-medium text-gray-700">Client PIC Title:</label>
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
            <label className="block text-sm font-medium text-gray-700">Business Sector:</label>
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
        </form>
      </div>
    </div>
  );
};

export default InputClient;