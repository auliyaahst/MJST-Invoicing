import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./AuthContext";

const InputOrder = () => {
  const [orderID, setOrderID] = useState("");
  const [clientID, setClientID] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [clients, setClients] = useState([]);
  const { username } = useContext(AuthContext);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/client-names", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err.message);
        toast.error("Failed to fetch clients.");
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      orderID,
      clientID,
      orderDate,
      orderTotal,
      companyID: "CMP001",
      createdUser: username,
      modifiedUser: username,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order created successfully!");
      setOrderID("");
      setClientID("");
      setOrderDate("");
      setOrderTotal("");
    } catch (err) {
      console.error("Error creating order:", err.message);
      toast.error("Error creating order. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-center mb-6">Create Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order ID</label>
          <input
            type="text"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <select
            value={clientID}
            onChange={(e) => setClientID(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.clientid} value={client.clientid}>
                {client.clientname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Total</label>
          <input
            type="number"
            value={orderTotal}
            onChange={(e) => setOrderTotal(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Order
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default InputOrder;
