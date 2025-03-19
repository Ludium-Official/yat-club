require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { withAuth } = require("./middleware/auth");

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// https://api.moonpay.com/v3/currencies/eth/buy_quote?baseCurrencyCode=usd&paymentMethod=credit_debit_card&baseCurrencyAmount=20&apiKey=pk_test_rzPGsiZKEgaKOgWXh8aVTlLOcdP0Lke&fixed=true
// fixed=true로 하면 signature도 나옴
// buy_quote -> from_quote

// Users
app.post("/user", withAuth, (req, res) => {
  const { userId } = req.body;
  const query = "SELECT * FROM yatClub.Users WHERE userId = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results);
  });
});

app.post("/register", withAuth, (req, res) => {
  const { email, provider, userId, walletId } = req.body;
  const query =
    "INSERT INTO yatClub.Users (email, provider, userId, walletId) VALUES (?, ?, ?, ?)";

  db.query(query, [email, provider, userId, walletId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
