const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to authenticate and extract user info from JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to create a new user
app.post("/register", async (req, res) => {
  const { fullname, username, department, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (UserFullName, UserName, UserDepartment, UserEmail, UserPassword) VALUES ($1, $2, $3, $4, $5)",
      [fullname, username, department, email, hashedPassword]
    );

    res.status(201).send("User created");
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to handle login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE UserName = $1", [
      username
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].userpassword
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { user_id: user.rows[0].userid, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.rows[0].username });
    console.log("User logged in:", user.rows[0].username); // Debugging line
    console.log("Token generated:", token); // Debugging line
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to create a new client
app.post("/clients", authenticateToken, async (req, res) => {
  const {
    clientName,
    clientAddress,
    clientProvince,
    clientZipCode,
    clientPhone,
    clientPIC,
    clientPICTitle,
    businessSector
  } = req.body;

  const createdUser = req.user.username;
  const modifiedUser = req.user.username;

  try {
    await pool.query(
      "INSERT INTO clients (ClientName, ClientAddress, ClientProvince, ClientZipCode, ClientPhone, ClientPIC, ClientPICTitle, BusinessSector, CreatedUser, ModifiedUser) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        clientName,
        clientAddress,
        clientProvince,
        clientZipCode,
        clientPhone,
        clientPIC,
        clientPICTitle,
        businessSector,
        createdUser,
        modifiedUser
      ]
    );

    res.status(201).send("Client created");
  } catch (err) {
    console.error("Error creating client:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch all clients
app.get("/clients", authenticateToken, async (req, res) => {
  try {
    const clients = await pool.query("SELECT * FROM clients");
    console.log("Clients fetched:", clients.rows); // Debugging line
    res.json(clients.rows);
  } catch (err) {
    console.error("Error fetching clients:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch company master data
app.get("/company-master", authenticateToken, async (req, res) => {
  try {
    const company = await pool.query("SELECT * FROM CompanyMaster LIMIT 1");
    res.json(company.rows[0]);
    console.log("Company data fetched:", company.rows[0]); // Debugging line
  } catch (err) {
    console.error("Error fetching company data:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to create company master data
app.post("/company-master", authenticateToken, async (req, res) => {
  const {
    companyname,
    companyaddress,
    companydirector,
    companydirtitle,
    companyphone,
    companypic,
    companypictitle,
    invoicenotes
  } = req.body;

  console.log("Received data for creating company:", req.body);

  try {
    await pool.query(
      "INSERT INTO CompanyMaster (CompanyName, CompanyAddress, CompanyDirector, CompanyDirTitle, CompanyPhone, CompanyPIC, CompanyPICTitle, InvoiceNotes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        companyname,
        companyaddress,
        companydirector,
        companydirtitle,
        companyphone,
        companypic,
        companypictitle,
        invoicenotes
      ]
    );

    res.status(201).send("Company data created");
  } catch (err) {
    console.error("Error creating company data:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to update company master data
app.put("/company-master", authenticateToken, async (req, res) => {
  const {
    companyname,
    companyaddress,
    companydirector,
    companydirtitle,
    companyphone,
    companypic,
    companypictitle,
    invoicenotes
  } = req.body;

  console.log("Received data for updating company:", req.body);

  try {
    await pool.query(
      "UPDATE CompanyMaster SET CompanyName = $1, CompanyAddress = $2, CompanyDirector = $3, CompanyDirTitle = $4, CompanyPhone = $5, CompanyPIC = $6, CompanyPICTitle = $7, InvoiceNotes = $8 WHERE CompanyID = 'CMP001'",
      [
        companyname,
        companyaddress,
        companydirector,
        companydirtitle,
        companyphone,
        companypic,
        companypictitle,
        invoicenotes
      ]
    );

    res.status(200).send("Company data updated");
  } catch (err) {
    console.error("Error updating company data:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to create a new order
app.post("/orders", authenticateToken, async (req, res) => {
  const { orderID, clientID, orderDate, orderTotal, companyID } = req.body;

  const createdUser = req.user.username;
  const modifiedUser = req.user.username;

  console.log("Received Order Data:", req.body); // Debugging line

  try {
    await pool.query(
      "INSERT INTO orders (OrderID, OrderDate, OrderTotal, ClientID, CompanyID, CreatedUser, ModifiedUser) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        orderID,
        orderDate,
        orderTotal,
        clientID,
        companyID,
        createdUser,
        modifiedUser
      ]
    );

    res.status(201).send("Order created");
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch client names
app.get("/client-names", authenticateToken, async (req, res) => {
  try {
    const clients = await pool.query(
      "SELECT ClientID, ClientName FROM clients"
    );
    res.json(clients.rows);
  } catch (err) {
    console.error("Error fetching client names:", err.message);
    res.status(500).send("Server error");
  }
});

// Route to fetch all orders
app.get("/orderlist", authenticateToken, async (req, res) => {
  try {
    const orderlist = await pool.query(`
      SELECT o.OrderID, o.OrderDate, o.OrderTotal, o.CreatedUser, o.ModifiedUser, c.ClientName
      FROM orders o
      JOIN clients c ON o.ClientID = c.ClientID
    `);
    res.json(orderlist.rows);
  } catch (err) {
    console.error("Error fetching order list:", err.message);
    res.status(500).send("Server error");
  }
});

app.post("/invoices", authenticateToken, async (req, res) => {
  const {
    invoiceNo,
    invoiceDate,
    clientID,
    companyID, // Ensure this is destructured
    contractNumber,
    billingDescription,
    billingQty,
    billingPrice,
    lineTotal,
    subTotal,
    vat,
    salesTax,
    invoiceTotal
  } = req.body;

  const createdUser = req.user.username;
  const modifiedUser = req.user.username;

  try {
    await pool.query(
      "INSERT INTO Invoices (InvoiceNo, InvoiceDate, ClientID, CompanyID, ContractNumber, BillingDescription, BillingQty, BillingPrice, LineTotal, SubTotal, VAT, SalesTax, InvoiceTotal, CreatedUser, ModifiedUser) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
      [
        invoiceNo,
        invoiceDate,
        clientID,
        companyID, // Ensure it's passed here
        contractNumber,
        billingDescription,
        billingQty,
        billingPrice,
        lineTotal,
        subTotal,
        vat,
        salesTax,
        invoiceTotal,
        createdUser,
        modifiedUser
      ]
    );
    res.status(201).send("Invoice created");
  } catch (err) {
    console.error("Error creating invoice:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/invoices/count", async (req, res) => {
  const { date } = req.query;
  try {
    const count = await pool.query(
      "SELECT COUNT(*) FROM Invoices WHERE DATE(invoiceDate) = $1",
      [date]
    );
    res.json({ count: parseInt(count.rows[0].count, 10) }); // Ensure numeric conversion
  } catch (error) {
    console.error("Error fetching invoice count:", error.message);
    res.status(500).json({ error: "Failed to fetch invoice count" });
  }
});

app.get("/invoices", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching invoices..."); // Debugging line
    const invoices = await pool.query(`
      SELECT 
        i.InvoiceID, i.InvoiceNo, i.InvoiceDate, 
        c.ClientName, i.InvoiceTotal 
      FROM Invoices i
      JOIN Clients c ON i.ClientID = c.ClientID
    `);
    console.log("Invoices fetched:", invoices.rows); // Debugging line
    res.json(invoices.rows);
  } catch (err) {
    console.error("Error fetching invoices:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/invoices/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching details for invoice ID: ${id}`); // Debugging line

    const invoice = await pool.query(
      `
      SELECT 
        i.InvoiceNo, i.InvoiceDate, i.InvoiceTotal, 
        i.BillingDescription, i.BillingQty, i.BillingPrice,  i.LineTotal, i.SubTotal, i.VAT, i.SalesTax,
        c.ClientName, c.ClientAddress, c.ClientPhone, c.ClientPIC, c.ClientPICTitle, cm.CompanyName, cm.CompanyAddress, cm.CompanyDirector, cm.CompanyDirTitle, cm.CompanyPhone, cm.CompanyPIC, cm.CompanyPICTitle, cm.InvoiceNotes
      FROM Invoices i
      JOIN Clients c ON i.ClientID = c.ClientID
      JOIN CompanyMaster cm ON i.CompanyID = cm.CompanyID
      WHERE i.InvoiceID = $1
    `,
      [id]
    );

    if (invoice.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    console.log("Invoice details fetched:", invoice.rows[0]); // Debugging line
    res.json(invoice.rows[0]);
  } catch (err) {
    console.error("Error fetching invoice details:", err.message);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
