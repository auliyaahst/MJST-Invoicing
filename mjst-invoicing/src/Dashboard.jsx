import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");

        const invoiceResponse = await axios.get("http://localhost:5000/invoices", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const invoices = invoiceResponse.data;
        setInvoiceCount(invoices.length);

        const clientResponse = await axios.get("http://localhost:5000/clients", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClientCount(clientResponse.data.length);

        const totalRevenue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.invoicetotal), 0);
        setTotalRevenue(totalRevenue);

        // Calculate monthly revenue
        const revenueByMonth = Array(12).fill(0);
        invoices.forEach(invoice => {
          const month = new Date(invoice.invoicedate).getMonth();
          revenueByMonth[month] += parseFloat(invoice.invoicetotal);
        });
        setMonthlyRevenue(revenueByMonth);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
  };

  return (
    <div className="flex-grow p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Invoices</h2>
          <p className="text-2xl font-bold">{invoiceCount}</p>
          <a href="/invoice-list" className="text-blue-600 hover:underline">View Invoices</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Clients</h2>
          <p className="text-2xl font-bold">{clientCount}</p>
          <a href="/client-list" className="text-blue-600 hover:underline">View Clients</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Revenue</h2>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 w-full max-w-full lg:max-w-lg">
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-56">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;