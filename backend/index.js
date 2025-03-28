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
  const query = "SELECT * FROM yatclub.Users WHERE userId = ?";

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
    "INSERT INTO yatclub.Users (email, provider, userId, walletId) VALUES (?, ?, ?, ?)";

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
  let query = `
    SELECT 
        e.*,
        SUM(CASE WHEN r.status IN ('confirmed', 'completed') THEN 1 ELSE 0 END) AS reservation_count
    FROM 
        yatclub.Events e
    LEFT JOIN 
        yatclub.Reservations r ON e.id = r.event_id
  `;

  if (isPast) {
    query += " WHERE e.start_at < NOW()";
  } else {
    query += " WHERE e.start_at >= NOW()";
  }

  query += `
    GROUP BY 
        e.id, e.title
  `;

  query += " order by start_at";

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
  const query = "SELECT * FROM yatclub.Events WHERE id = ?";

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
    "SELECT * FROM yatclub.Reservations WHERE event_id = ? AND user_id = ?";

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
    "INSERT INTO yatclub.Reservations (user_id, event_id, pay_method) VALUES (?, ?, ?)";

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
