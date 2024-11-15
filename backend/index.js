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
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (UserName, UserEmail, UserPassword) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});