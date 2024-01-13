const express = require("express");
const { Pool } = require("pg");
const path = require("path"); // Add this line to import the 'path' module

const app = express();

const pool = new Pool({
  connectionString:
    "postgresql://postgres:vjH2YQiIEZVvepJ21yH2@containers-us-west-82.railway.app:5680/railway",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// API endpoint to add a new surf break
app.post("/add_break", (req, res) => {
  const {
    location,
    spot,
    wave,
    coordinates,
    tide,
    wind,
    swell,
    bottom,
    wavedirection,
    swellexposure,
    surfforecast,
    safety,
  } = req.body;
  const sqlQuery =
    "INSERT INTO geodata (location, spot, wave, coordinates, tide, wind, swell, bottom, wavedirection, swellexposure, surfforecast, safety) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

  const values = [
    location,
    spot,
    wave,
    coordinates,
    tide,
    wind,
    swell,
    bottom,
    wavedirection,
    swellexposure,
    surfforecast,
    safety,
  ];

  pool
    .query(sqlQuery, values)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error("Error adding surf break:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to add surf break" });
    });
});

// Define an API endpoint
app.get("/geodata", (req, res) => {
  const sqlQuery =
    "SELECT location, spot, wave, coordinates, tide, wind, swell, bottom, wavedirection, swellexposure, surfforecast, safety FROM geodata;";
  pool
    .query(sqlQuery)
    .then((result) => {
      const surfBreaks = result.rows;
      res.json(surfBreaks);
    })
    .catch((err) => {
      console.error("error executing query", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Catch-all route to serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(4066, () => {
  console.log("Server started on port 4066");
});
