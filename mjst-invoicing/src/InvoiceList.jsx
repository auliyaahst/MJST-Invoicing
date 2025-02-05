import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import Logo from "./assets/mjst png.png";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/invoices", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched invoices:", response.data);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices.");
      }
    };

    fetchInvoices();
  }, []);

  const handleViewDetails = async invoiceId => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Fetched invoice details:", response.data);
      setSelectedInvoice(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to fetch invoice details.");
    }
  };

  const openDeleteModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedInvoiceId(null);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInvoice(null);
  };

  const deleteInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/invoices/${selectedInvoiceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(invoices.filter(invoice => invoice.invoiceid !== selectedInvoiceId));
      toast.success("Invoice deleted successfully");
    } catch (err) {
      console.error("Error deleting invoice:", err.message);
      toast.error("Failed to delete invoice");
    } finally {
      closeDeleteModal();
    }
  };

  const formatCurrency = value => {
    const formattedValue = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    return formattedValue.replace(/\./g, ",");
  };

  const formatDate = dateString => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDate(invoice.invoicedate).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-screen p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Invoice List</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search invoice..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full bg-white rounded-lg shadow-md text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-gray-600 border border-gray-200">
                Invoice No
              </th>
              <th className="py-2 px-4 border-b text-gray-600 border border-gray-200">
                Client Name
              </th>
              <th className="py-2 px-4 border-b text-gray-600 border border-gray-200">
                Invoice Date
              </th>
              <th className="py-2 px-4 border-b text-gray-600 border border-gray-200">
                Total
              </th>
              <th className="py-2 px-4 border-b text-gray-600 border border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0
              ? filteredInvoices.map(invoice => (
                  <tr key={invoice.invoiceid} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border border-gray-200">
                      {invoice.invoiceno}
                    </td>
                    <td className="py-2 px-4 border-b border border-gray-200">
                      {invoice.clientname}
                    </td>
                    <td className="py-2 px-4 border-b border border-gray-200">
                      {formatDate(invoice.invoicedate)}
                    </td>
                    <td className="py-2 px-4 border-b border border-gray-200">
                      {formatCurrency(invoice.invoicetotal)}
                    </td>
                    <td className="py-2 px-4 border-b border border-gray-200">
                      <button
                        onClick={() => handleViewDetails(invoice.invoiceid)}
                        className="w-full px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openDeleteModal(invoice.invoiceid)}
                        className="w-full px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan="5" className="py-2 px-4 border-b text-center">
                    No invoices found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {isDetailsModalOpen && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeDetailsModal}
          />
          <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-4xl max-h-full mx-auto overflow-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(selectedInvoice.invoicedate)}
                </p>
                <p className="text-sm text-gray-600">
                  No: {selectedInvoice.invoiceno}
                </p>
              </div>
              <div className="text-center">
                <img src={Logo} alt="Company Logo" className="w-32 h-auto" />
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Client Details */}
              <div>
                <h3 className="text-sm font-bold underline">To:</h3>
                <p className="text-sm">
                  {selectedInvoice.clientname}
                </p>
                <p className="text-sm">
                  {selectedInvoice.clientaddress}
                </p>
                <p className="text-sm">
                  Telp: {selectedInvoice.clientphone}
                </p>
                <p className="text-sm mt-2 underline">Attention:</p>
                <p className="text-sm">
                  {selectedInvoice.clientpic}
                </p>
                <p className="text-sm">
                  {selectedInvoice.clientpictitle}
                </p>
              </div>
              {/* Company Details */}
              <div>
                <h3 className="text-sm font-bold underline">From:</h3>
                <p className="text-sm">
                  {selectedInvoice.companyname}
                </p>
                <p className="text-sm">
                  {selectedInvoice.companyaddress}
                </p>
                <p className="text-sm">
                  Phone: {selectedInvoice.companyphone}
                </p>
                <p className="text-sm mt-2 underline">Contact:</p>
                <p className="text-sm">
                  {selectedInvoice.companypic}
                </p>
                <p className="text-sm">
                  {selectedInvoice.companypictitle}
                </p>
              </div>
            </div>

            {/* Billing Details */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 text-sm py-2 px-4">
                      DESCRIPTION
                    </th>
                    <th className="border border-gray-300 text-sm py-2 px-4">
                      QTY
                    </th>
                    <th className="border border-gray-300 text-sm py-2 px-4">
                      UNIT PRICE
                    </th>
                    <th className="border border-gray-300 text-sm py-2 px-4">
                      LINE TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 text-sm py-2 px-4">
                      {selectedInvoice.billingdescription}
                    </td>
                    <td className="border border-gray-300 text-sm py-2 px-4 text-center">
                      {formatCurrency(selectedInvoice.billingqty)}
                    </td>
                    <td className="border border-gray-300 text-sm py-2 px-4 text-center">
                      {formatCurrency(selectedInvoice.billingprice)}
                    </td>
                    <td className="border border-gray-300 text-sm py-2 px-4 text-center">
                      {formatCurrency(selectedInvoice.linetotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="text-right mb-6">
              <p className="text-sm">
                <strong>SUBTOTAL:</strong>{" "}
                {formatCurrency(selectedInvoice.subtotal)}
              </p>
              <p className="text-sm">
                <strong>Sales Tax:</strong>{" "}
                {formatCurrency(selectedInvoice.salestax)}
              </p>
              <p className="text-sm">
                <strong>2% VAT:</strong> {formatCurrency(selectedInvoice.vat)}
              </p>
              <p className="text-lg font-bold">
                <strong>TOTAL:</strong>{" "}
                {formatCurrency(selectedInvoice.invoicetotal)}
              </p>
            </div>

            {/* Notes */}
            {/* <div className="mb-6">
              <h3 className="text-sm font-bold underline">Notes:</h3>
              <ul className="text-sm list-disc list-inside">
                {selectedInvoice.invoicenotes.split("\n").map((note, index) =>
                  <li key={index}>
                    {note}
                  </li>
                )}
              </ul>
            </div> */}

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedInvoice} />}
                fileName={`invoice_${selectedInvoice.invoiceno}.pdf`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                {({ loading }) =>
                  loading ? "Loading document..." : "Generate PDF"}
              </PDFDownloadLink>
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this invoice?</p>
            <div className="flex justify-between space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={deleteInvoice}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;