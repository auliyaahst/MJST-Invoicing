import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./AuthContext";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { username } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/orderlist", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
        console.log("Fetched orders:", response.data);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        toast.error("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-center mb-6">Order List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Client Name</th>
            <th className="py-2 px-4 border-b">Order Date</th>
            <th className="py-2 px-4 border-b">Order Total</th>
            <th className="py-2 px-4 border-b">Created User</th>
            <th className="py-2 px-4 border-b">Modified User</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0
            ? <tr>
                <td colSpan="6" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            : orders.map(order =>
                <tr key={order.orderid}>
                  <td className="py-2 px-4 border-b">
                    {order.orderid}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.clientname}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.orderdate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                  {formatCurrency(order.ordertotal)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.createduser}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.modifieduser}
                  </td>
                </tr>
              )}
        </tbody>
      </table>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default OrderList;
