import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputInvoice = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [clients, setClients] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [billingDescription, setBillingDescription] = useState("");
  const [billingQty, setBillingQty] = useState(1);
  const [billingPrice, setBillingPrice] = useState(0);
  const [vat, setVat] = useState(false);
  const [salesTaxAmount, setSalesTaxAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);

  // Bulan dalam format Romawi
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  const calculateTotals = () => {
    const lineTotal = billingQty * billingPrice;
    const vatAmount = vat ? lineTotal * 0.02 : 0; // 2% VAT if applicable
    const salesTaxAmount = lineTotal * 0.11; // 11% Sales Tax
    const total = lineTotal + vatAmount + salesTaxAmount;
    setSubTotal(lineTotal);
    setInvoiceTotal(total);
    setSalesTaxAmount(salesTaxAmount);
  };

  const generateInvoiceNo = async (selectedDate) => {
    const currentDate = new Date(selectedDate);
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth(); // Index bulan dimulai dari 0
    const romanMonth = romanMonths[monthIndex];

    try {
      // Fetch the count of invoices for the selected date from the backend
      const response = await axios.get(`http://localhost:5000/invoices/count?date=${selectedDate}`);
      const invoiceCount = response.data.count || 0;

      // Generate the invoice number
      const newInvoiceNo = `${String(invoiceCount + 1).padStart(2, "0")}-${day}/INV/MJST/${romanMonth}/${year}`;
      console.log("Generated Invoice Number:", newInvoiceNo);
      return newInvoiceNo;
    } catch (error) {
      console.error("Error fetching daily invoice count:", error);
      // If there's an error, default the invoice number to "01"
      const newInvoiceNo = `01-${day}/INV/MJST/${romanMonth}/${year}`;
      console.log("Default Invoice Number:", newInvoiceNo);
      return newInvoiceNo;
    }
  };

  const handleInvoiceDateChange = async (e) => {
    const newDate = e.target.value;
    setInvoiceDate(newDate);

    // Regenerate the invoice number based on the new date
    const newInvoiceNo = await generateInvoiceNo(newDate);
    setInvoiceNo(newInvoiceNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = {
      invoiceNo,
      invoiceDate,
      clientID: selectedClientID,
      contractNumber,
      billingDescription,
      billingQty,
      billingPrice,
      lineTotal: subTotal,
      subTotal,
      vat: vat ? subTotal * 0.02 : 0, // 2% VAT if applicable
      salesTax: subTotal * 0.11, // 11% Sales Tax
      invoiceTotal,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/invoices", invoiceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Invoice created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Refresh the page after 3 seconds
    } catch (err) {
      console.error("Error creating invoice:", err);
      toast.error("Error creating invoice. Please try again.");
    }
  };

  useEffect(() => {
    // Generate the initial invoice number for the default date
    (async () => {
      const initialInvoiceNo = await generateInvoiceNo(invoiceDate);
      setInvoiceNo(initialInvoiceNo);
    })();

    // Fetch the list of clients from the backend
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/client-names", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched clients:", response.data); // Debugging line
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to fetch clients.");
      }
    })();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [billingQty, billingPrice, vat]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Invoice No:</label>
          <input
            type="text"
            value={invoiceNo}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Invoice Date:</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Client Name:</label>
          <select
            value={selectedClientID}
            onChange={(e) => setSelectedClientID(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.clientid} value={client.clientid}>
                {client.clientname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contract Number:</label>
          <input
            type="text"
            value={contractNumber}
            onChange={(e) => setContractNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Billing Description:</label>
          <textarea
            value={billingDescription}
            onChange={(e) => setBillingDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              value={billingQty}
              onChange={(e) => setBillingQty(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              value={billingPrice}
              onChange={(e) => setBillingPrice(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Add VAT:</label>
          <select
            value={vat}
            onChange={(e) => setVat(e.target.value === "true")}
            className="w-full p-2 border rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700">Sales Tax:</label>
            <input
                type="number"
                value={salesTaxAmount}
                disabled
                className="w-full p-2 border rounded"
            />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Subtotal:</label>
          <input
            type="number"
            value={subTotal}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Total:</label>
          <input
            type="number"
            value={invoiceTotal}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default InputInvoice;