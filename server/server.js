require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
const urlDB = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const db = mysql.createConnection(urlDB);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Initialize seats table
app.get("/init-seats", (req, res) => {
  let createTable = `
    CREATE TABLE IF NOT EXISTS seats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seat_number INT,
      is_booked BOOLEAN DEFAULT FALSE
    )`;

  db.query(createTable, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      res.status(500).json({ error: "Error creating table" });
    } else {
      let insertSeats = `
        INSERT INTO seats (seat_number) 
        VALUES ${Array.from({ length: 80 }, (_, i) => `(${i + 1})`).join(",")}
        ON DUPLICATE KEY UPDATE seat_number = seat_number
      `;
      db.query(insertSeats, (err, result) => {
        if (err) {
          console.error("Error inserting seats:", err);
          res.status(500).json({ error: "Error inserting seats" });
        } else {
          res.status(200).json({ message: "Seats initialized" });
        }
      });
    }
  });
});

// Get all seat statuses
app.get("/seats", (req, res) => {
  db.query("SELECT * FROM seats", (err, results) => {
    if (err) {
      console.error("Error fetching seats:", err);
      res.status(500).json({ error: "Error fetching seats" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Reserve seats
app.post("/reserve", (req, res) => {
  const { numberOfSeats } = req.body;
  const seatsPerRow = 7; // First 11 rows have 7 seats
  const lastRowSeats = 3; // Last row has 3 seats
  const totalSeats = 80;

  // Step 1: Fetch all available seats
  db.query(
    "SELECT seat_number, is_booked FROM seats WHERE is_booked = FALSE",
    (err, results) => {
      if (err) {
        console.error("Error fetching available seats:", err);
        return res
          .status(500)
          .json({ error: "Error fetching available seats" });
      }

      // Step 2: Group seats by row
      const rows = {}; // Object to store seats grouped by rows
      results.forEach((seat) => {
        const seatNumber = seat.seat_number;
        let row;

        // Handle normal rows (1-77) and the last row (78-80)
        if (seatNumber <= 77) {
          row = Math.floor((seatNumber - 1) / seatsPerRow); // First 11 rows
        } else {
          row = 11; // Last row (seats 78, 79, 80)
        }

        if (!rows[row]) {
          rows[row] = [];
        }
        rows[row].push(seatNumber);
      });

      // Step 3: Check each row for consecutive available seats
      let reservedSeats = [];
      for (const row in rows) {
        if (reservedSeats.length >= numberOfSeats) break; // Stop if we already have enough seats

        const availableSeats = rows[row];

        // Check for consecutive seats (handle last row differently)
        if (row < 11) {
          // Rows with 7 seats
          for (let i = 0; i <= availableSeats.length - numberOfSeats; i++) {
            const seatsBlock = availableSeats.slice(i, i + numberOfSeats);
            // Check if all seats in this block are consecutive
            const isConsecutive = seatsBlock.every(
              (seat, idx) => idx === 0 || seat === seatsBlock[idx - 1] + 1
            );

            if (isConsecutive) {
              reservedSeats = reservedSeats.concat(seatsBlock);
              break;
            }
          }
        } else {
          // Last row with 3 seats
          if (availableSeats.length >= numberOfSeats) {
            reservedSeats = reservedSeats.concat(
              availableSeats.slice(0, numberOfSeats)
            );
            break;
          }
        }
      }

      // Step 4: If not enough consecutive seats found, find nearby seats
      if (reservedSeats.length < numberOfSeats) {
        // Gather all available seats in order
        const allAvailableSeats = results
          .map((seat) => seat.seat_number)
          .sort((a, b) => a - b);

        // Use a Set to avoid duplicates
        const reservedSet = new Set(reservedSeats);

        // Step 5: Find nearby seats from the list of all available seats
        for (const seat of allAvailableSeats) {
          if (reservedSeats.length < numberOfSeats && !reservedSet.has(seat)) {
            reservedSeats.push(seat);
          }
        }
      }

      // Step 6: If enough seats are found, reserve them
      if (reservedSeats.length >= numberOfSeats) {
        db.query(
          "UPDATE seats SET is_booked = TRUE WHERE seat_number IN (?)",
          [reservedSeats],
          (err, result) => {
            if (err) {
              console.error("Error reserving seats:", err);
              return res.status(500).json({ error: "Error reserving seats" });
            }
            return res
              .status(200)
              .json({ message: "Seats reserved", seats: reservedSeats });
          }
        );
      } else {
        return res.status(400).json({ error: "Not enough seats available" });
      }
    }
  );
});

// Delete reservation (unbook seats)
app.post("/cancel", (req, res) => {
  const { seatNumbers } = req.body;

  db.query(
    "UPDATE seats SET is_booked = FALSE WHERE seat_number IN (?)",
    [seatNumbers],
    (err, result) => {
      if (err) {
        console.error("Error cancelling seats:", err);
        res.status(500).json({ error: "Error cancelling seats" });
      } else {
        res.status(200).json({ message: "Seats cancelled" });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// reset all
app.get("/reset-seats", (req, res) => {
  db.query("UPDATE seats SET is_booked = FALSE", (err, result) => {
    if (err) {
      console.error("Error resetting seat bookings:", err);
      res.status(500).json({ error: "Error resetting seat bookings" });
    } else {
      res
        .status(200)
        .json({ message: "All seats have been reset to available" });
    }
  });
});
