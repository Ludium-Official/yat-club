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

// Events
app.post("/events", withAuth, (req, res) => {
  const { isPast } = req.body;
  let query = "SELECT * FROM yatClub.Events";

  if (isPast) {
    query += " WHERE start_at < NOW()";
  } else {
    query += " WHERE start_at >= NOW()";
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results);
  });
});

app.post("/event", withAuth, (req, res) => {
  const { id } = req.body;
  const query = "SELECT * FROM yatClub.Events WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results[0]);
  });
});

// Reservations
app.post("/reservation", withAuth, (req, res) => {
  const { id, userId } = req.body;
  const query =
    "SELECT * FROM yatClub.Reservations WHERE event_id = ? AND user_id = ?";

  db.query(query, [id, userId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results[0]);
  });
});

app.post("/booking", withAuth, (req, res) => {
  const { userId, eventId, payMethod } = req.body;
  const query =
    "INSERT INTO yatClub.Reservations (user_id, event_id, pay_method) VALUES (?, ?, ?)";

  db.query(query, [userId, eventId, payMethod], (err, results) => {
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
