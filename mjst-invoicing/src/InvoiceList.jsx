import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "./assets/mjst png.png";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to fetch invoice details.");
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

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 8,
      fontFamily: "Helvetica",
      color: "#333"
    },
    logoContainer: {
      textAlign: "center",
      alignItems: "center"
    },
    logo: {
      width: 120,
      height: 80,
      marginBottom: 10
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    },
    invoiceTitle: {
      fontSize: 24,
      color: "#0073e6",
      fontWeight: "bold",
      marginBottom: 10
    },
    infoText: {
      fontSize: 8
    },
    section: {
      marginBottom: 8
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    },
    detailsColumn: {
      width: "45%"
    },
    sectionTitle: {
      fontSize: 8,
      fontWeight: "bold",
      marginBottom: 5
    },
    sectionPICTitle: {
      fontSize: 8,
      fontWeight: "bold",
      marginTop: 10,
      textDecoration: "underline"
    },
    detailsText: {
      fontSize: 8,
      marginBottom: 2
    },
    boldText: {
      fontSize: 8,
      fontWeight: "bold",
      marginBottom: 2,
      fontFamily: "Helvetica-Bold"
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      backgroundColor: "#f5f5f5",
      paddingVertical: 5
    },
    tableCell: {
      textAlign: "center",
      padding: 5,
      fontSize: 8
    },
    tableCellDesc: {
      textAlign: "justify",
      padding: 5,
      fontSize: 8
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd"
    },
    totalSection: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#000",
      paddingTop: 10
    },
    totalLabel: {
      textAlign: "right",
      padding: 5,
      fontSize: 8,
      fontWeight: "bold"
    },
    totalValue: {
      textAlign: "center",
      padding: 5,
      fontSize: 8,
      fontWeight: "bold"
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5
    },
    notes: {
      marginTop: 20
    },
    bulletPoint: {
      fontSize: 8,
      marginBottom: 2
    },
    subline: {
      fontSize: 8,
      marginLeft: 10,
      marginBottom: 2,
      fontWeight: "bold",
      fontFamily: "Helvetica-Bold"
    },
    signatureSection: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    signatureColumn: {
      width: "15%",
      textAlign: "center"
    },
    signatureText: {
      fontSize: 8,
      fontWeight: "bold",
      fontFamily: "Helvetica-Bold",
      marginTop: 60,
      textDecoration: "underline",
      textAlign: "center"
    },
    signatureLabel: {
      fontSize: 8,
      marginTop: 5
    },
    signatureCompany: {
      fontSize: 8,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 2
    }
  });

  const InvoiceDocument = ({ invoice }) => {
    const notes = invoice.invoicenotes.split("\n");
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            {/* Left: Invoice Title and Details */}
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.infoText}>
                Date: {formatDate(invoice.invoicedate)}
              </Text>
              <Text style={styles.infoText}>
                No. {invoice.invoiceno}
              </Text>
            </View>
            {/* Right: Logo */}
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src={Logo} />
            </View>
          </View>

          {/* Client and Company Details */}
          <View style={styles.detailsContainer}>
            {/* Left: Client Details */}
            <View>
              <Text style={styles.sectionTitle}>To:</Text>
              <Text style={styles.boldText}>
                {invoice.clientname}
              </Text>
              <Text style={styles.detailsText}>
                {invoice.clientaddress}
              </Text>
              <Text style={styles.detailsText}>
                Telp: {invoice.clientphone}
              </Text>
              <View style={styles.detailsColumn}>
                <Text style={styles.sectionPICTitle}>Attention:</Text>
                <Text style={styles.detailsText}>
                  {invoice.clientpic}
                </Text>
                <Text style={styles.detailsText}>
                  {invoice.clientpictitle}
                </Text>
              </View>
            </View>
            {/* Right: Company Details */}
            <View>
              <Text style={styles.sectionTitle}>From:</Text>
              <Text style={styles.boldText}>
                {invoice.companyname}
              </Text>
              <Text style={styles.detailsText}>
                {invoice.companyaddress}
              </Text>
              <Text style={styles.detailsText}>
                Phone: {invoice.companyphone}
              </Text>
              <View style={styles.detailsColumn}>
                <Text style={styles.sectionPICTitle}>Contact:</Text>
                <Text style={styles.detailsText}>
                  {invoice.companypic}
                </Text>
                <Text style={styles.detailsText}>
                  {invoice.companypictitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Billing Details */}
          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>Billing Details</Text> */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 3 }]}>DESCRIPTION</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>QTY</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>UNIT PRICE</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>LINE TOTAL</Text>
            </View>
            {/* Table Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellDesc, { flex: 3 }]}>
                {invoice.billingdescription}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {formatCurrency(invoice.billingqty)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {formatCurrency(invoice.billingprice)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {formatCurrency(invoice.linetotal)}
              </Text>
            </View>
            {/* Subtotal */}
            <View style={[styles.totalRow]}>
              <Text style={[styles.totalLabel, { flex: 4 }]}>SUBTOTAL</Text>
              <Text style={[styles.totalValue, { flex: 1 }]}>
                {formatCurrency(invoice.subtotal)}
              </Text>
            </View>
            {/*Sales Tax*/}
            <View style={[styles.totalRow]}>
              <Text style={[styles.totalLabel, { flex: 4 }]}>Sales Tax</Text>
              <Text style={[styles.totalValue, { flex: 1 }]}>
                {formatCurrency(invoice.salestax)}
              </Text>
            </View>
            {/* VAT */}
            <View style={[styles.totalRow]}>
              <Text style={[styles.totalLabel, { flex: 4 }]}>2% VAT</Text>
              <Text style={[styles.totalValue, { flex: 1 }]}>
                {formatCurrency(invoice.vat)}
              </Text>
            </View>
            {/* Total */}
            <View
              style={[
                styles.totalRow,
                { borderTopWidth: 1, borderTopColor: "#000" }
              ]}
            >
              <Text style={[styles.totalLabel, { flex: 4 }]}>TOTAL</Text>
              <Text style={[styles.totalValue, { flex: 1 }]}>
                {formatCurrency(invoice.invoicetotal)}
              </Text>
            </View>

            {/*Invoice Notes*/}
            <View style={styles.notes}>
              <Text style={styles.heading}>Notes:</Text>
              {notes.map((line, index) =>
                <Text
                  key={index}
                  style={
                    /^\d\./.test(line) ? styles.bulletPoint : styles.subline
                  }
                >
                  {line}
                </Text>
              )}
            </View>
          </View>
          {/* Signature Section */}
          <View>
            <Text style={styles.signatureCompany}>
              {invoice.companyname}
            </Text>
            <Text style={styles.signatureLabel}>
              Signature, Stamp, and Meterai
            </Text>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureText}>
                {invoice.companydirector}
              </Text>
              <Text style={styles.detailsText}>
                {invoice.companydirtitle}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="w-full h-screen p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Invoice List</h2>
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
          {invoices.length > 0
            ? invoices.map(invoice =>
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
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
            : <tr>
                <td colSpan="5" className="py-2 px-4 border-b text-center">
                  No invoices found
                </td>
              </tr>}
        </tbody>
      </table>

      {selectedInvoice &&
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          />
          <div className="bg-white p-6 rounded-lg shadow-lg z-50 max-w-4xl mx-auto max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
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
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  <td className="border border-gray-300 text-sm py-2 px-4">
                    {formatCurrency(selectedInvoice.billingqty)}
                  </td>
                  <td className="border border-gray-300 text-sm py-2 px-4">
                    {formatCurrency(selectedInvoice.billingprice)}
                  </td>
                  <td className="border border-gray-300 text-sm py-2 px-4">
                    {formatCurrency(selectedInvoice.linetotal)}
                  </td>
                </tr>
              </tbody>
            </table>

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
            <div className="mb-6">
              <h3 className="text-sm font-bold underline">Notes:</h3>
              <ul className="text-sm list-disc list-inside">
                {selectedInvoice.invoicenotes.split("\n").map((note, index) =>
                  <li key={index}>
                    {note}
                  </li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <PDFDownloadLink
                document={<InvoiceDocument invoice={selectedInvoice} />}
                fileName={`invoice_${selectedInvoice.invoiceno}.pdf`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {({ loading }) =>
                  loading ? "Loading document..." : "Generate PDF"}
              </PDFDownloadLink>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default InvoiceList;
