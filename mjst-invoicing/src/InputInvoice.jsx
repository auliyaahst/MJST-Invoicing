import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./AuthContext";

const InputInvoice = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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
  const { username } = useContext(AuthContext);

  const romanMonths = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII"
  ];

  const calculateTotals = () => {
    const lineTotal = billingQty * billingPrice;
    const vatAmount = vat ? lineTotal * 0.02 : 0;
    const salesTax = lineTotal * 0.11; // 11% Sales Tax
    const total = lineTotal + vatAmount + salesTax;
    setSubTotal(lineTotal);
    setInvoiceTotal(total);
    setSalesTaxAmount(salesTax); // Update this state
  };

  const generateInvoiceNo = async selectedDate => {
    const currentDate = new Date(selectedDate);
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth(); // Index bulan dimulai dari 0
    const romanMonth = romanMonths[monthIndex];

    try {
      const response = await axios.get(
        `http://localhost:5000/invoices/count?date=${selectedDate}`
      );
      const invoiceCount = response.data.count || 0;

      const newInvoiceNo = `${String(invoiceCount + 1).padStart(
        2,
        "0"
      )}-${day}/INV/MJST/${romanMonth}/${year}`;
      return newInvoiceNo;
    } catch (error) {
      console.error("Error generating invoice number:", error);
      return `01-${day}/INV/MJST/${romanMonth}/${year}`;
    }
  };

  const handleInvoiceDateChange = async e => {
    const newDate = e.target.value;
    setInvoiceDate(newDate);

    // Regenerate the invoice number based on the new date
    const newInvoiceNo = await generateInvoiceNo(newDate);
    setInvoiceNo(newInvoiceNo);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate numeric fields
    if (
      billingQty <= 0 ||
      billingPrice < 0 ||
      subTotal < 0 ||
      invoiceTotal < 0
    ) {
      toast.error(
        "Invalid input values. Please check the quantities and prices."
      );
      return;
    }

    const invoiceData = {
      invoiceNo,
      invoiceDate,
      clientID: selectedClientID,
      companyID: "CMP001",
      contractNumber,
      billingDescription,
      billingQty,
      billingPrice,
      lineTotal: subTotal,
      subTotal,
      vat: vat ? subTotal * 0.02 : 0, // 2% VAT if applicable
      salesTax: salesTaxAmount, // Use the salesTaxAmount state variable
      invoiceTotal,
      createdUser: username,
      modifiedUser: username
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/invoices", invoiceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  useEffect(
    () => {
      calculateTotals();
    },
    [billingQty, billingPrice, vat]
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-grow flex w-full items-center justify-center bg-gray-50">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
            Create Invoice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice No
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={handleInvoiceDateChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contract Number
                </label>
                <input
                  type="text"
                  value={contractNumber}
                  onChange={e => setContractNumber(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <select
                value={selectedClientID}
                onChange={e => setSelectedClientID(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a client</option>
                {clients.map(client =>
                  <option key={client.clientid} value={client.clientid}>
                    {client.clientname}
                  </option>
                )}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Billing Description
                </label>
                <textarea
                  value={billingDescription}
                  onChange={e => setBillingDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={billingQty}
                  onChange={e => setBillingQty(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={billingPrice}
                  onChange={e => setBillingPrice(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subtotal
                </label>
                <input
                  type="number"
                  value={subTotal}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sales Tax
                </label>
                <input
                  type="number"
                  value={salesTaxAmount}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Add VAT
                </label>
                <select
                  value={vat}
                  onChange={e => setVat(e.target.value === "true")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VAT
                </label>
                <input
                  type="number"
                  value={vat ? subTotal * 0.02 : 0}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <input
                type="number"
                value={invoiceTotal}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default InputInvoice;
