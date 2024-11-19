import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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
            Authorization: `Bearer ${token}`
          }
        });
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err.message);
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
      modifiedUser: username
    };

    console.log("Order Data:", orderData); // Debugging line

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Order created successfully");
    } catch (err) {
      console.error("Error creating order:", err.message);
      alert("Error creating order");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>OrderID:</label>
        <input
          type="text"
          value={orderID}
          onChange={(e) => setOrderID(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Client Name:</label>
        <select
          value={clientID}
          onChange={(e) => setClientID(e.target.value)}
          required
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
        <label>Order Date:</label>
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Order Total:</label>
        <input
          type="number"
          value={orderTotal}
          onChange={(e) => setOrderTotal(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Order</button>
    </form>
  );
};

export default InputOrder;