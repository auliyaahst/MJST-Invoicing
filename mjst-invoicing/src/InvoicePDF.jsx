import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import Logo from "./assets/mjst png.png";

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

const InvoicePDF = ({ invoice }) => {
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

export default InvoicePDF;