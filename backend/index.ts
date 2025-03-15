const express = require("express");
const db = require("./db.ts");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Backend!");
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM yatClub.Users";

  db.query(query, (err, results) => {
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
