require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { withAuth } = require("./middleware/auth");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.BUCKET_PROJECT_ID,
  keyFilename: "./config/yat-club-b2996cf03eeb.json",
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  method: ["PUT", "POST", "GET"],
  maxAgeSeconds: 3600,
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

app.post("/user/edit/name", withAuth, (req, res) => {
  const { userId, userName } = req.body;

  if (!userId || !userName) {
    return res
      .status(400)
      .send("Invalid input: userId and userName are required.");
  }

  const query = `
    UPDATE yatclub.Users
    SET name = ?
    WHERE userId = ?
  `;

  db.query(query, [userName, userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      return res.status(500).send("Database query error");
    }

    if (results.affectedRows > 0) {
      res.json({ success: true, message: "User name updated successfully." });
    } else {
      res.status(404).send("User not found.");
    }
  });
});

app.post("/user/edit/point", withAuth, (req, res) => {
  const { userId, point } = req.body;

  if (!userId || !point || point <= 0) {
    return res.status(400).send("Invalid input: check userId and point.");
  }

  const query = `
    UPDATE yatclub.Users
    SET yatPoint = yatPoint - ?
    WHERE id = ?
  `;

  db.query(query, [point, userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      return res.status(500).send("Database query error");
    }

    if (results.affectedRows > 0) {
      res.json({ success: true, message: "User point updated successfully." });
    } else {
      res.status(404).send("User not found.");
    }
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

app.post("/user-events", withAuth, (req, res) => {
  const { isPast, userId } = req.body;
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
    query += " WHERE e.start_at < NOW() AND r.user_id = ?";
  } else {
    query += " WHERE e.start_at >= NOW() AND r.user_id = ?";
  }

  query += `
    GROUP BY 
        e.id, e.title
  `;

  query += " ORDER BY e.start_at";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results);
  });
});

app.post("/event", withAuth, (req, res) => {
  const { id } = req.body;
  const query = `
    SELECT
      e.*,
      SUM(CASE WHEN r.status IN ('confirmed', 'completed') THEN 1 ELSE 0 END) AS reservation_count
    FROM
      yatclub.Events e
    LEFT JOIN
      yatclub.Reservations r
    ON
      e.id = r.event_id
    WHERE
      e.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results[0]);
  });
});

app.post("/event/create", withAuth, (req, res) => {
  const {
    userId,
    title,
    description,
    image_url,
    is_private,
    max_participants,
    receive_address,
    start_at,
    location,
    price,
    target,
  } = req.body;

  const query = `
    INSERT INTO yatclub.Events
      (owner_id, title, description, image_url, is_private, max_participants, receive_address, start_at, location, point_cost, price, token_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
      CASE WHEN ? = 'point' THEN ? ELSE NULL END, 
      CASE WHEN ? != 'point' THEN ? ELSE NULL END, 
      CASE WHEN ? != 'point' THEN ? ELSE NULL END
    )
  `;

  db.query(
    query,
    [
      userId,
      title,
      description,
      image_url,
      is_private,
      max_participants,
      receive_address,
      start_at,
      location,
      target,
      price,
      target,
      price,
      target,
      target,
    ],
    (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Database query error");
      }
      res.json({ success: true, eventId: results.insertId });
    }
  );
});

// Reservations
app.post("/reservations", withAuth, (req, res) => {
  const { userId } = req.body;

  const query = `
    SELECT
      r.id AS reservation_id,
      r.event_id,
      r.status AS reservation_status,
      e.title AS event_title,
      e.image_url AS event_image_url,
      e.start_at AS event_start_at,
      e.location AS event_location,
      e.is_private AS event_is_private
    FROM 
      yatclub.Reservations r
    INNER JOIN 
      yatclub.Events e
    ON 
      r.event_id = e.id
    WHERE 
      r.user_id = ?
    ORDER BY 
      e.start_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database query error");
    }
    res.json(results);
  });
});

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

// GCS bucket
app.post(
  "/upload-img-in-bucket",
  withAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const bucket = storage.bucket("yat-club");
      const file = req.file;

      if (!file) {
        console.error("No file uploaded.");
        return res.status(400).send("No file uploaded.");
      }

      const imgName = `events/${uuidv4()}`;

      const blob = bucket.file(imgName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      blobStream.on("error", (err) => {
        console.error("Upload error:", err);
        res.status(500).send("Failed to upload file.");
      });

      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send({ url: publicUrl });
      });

      blobStream.end(file.buffer);
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Internal server error.");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
