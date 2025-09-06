import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";   // 👈 import pg
import authRoutes from "./routes/auth";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ PostgreSQL connection
const pool = new Pool({
  user: "postgres",      // replace with your PostgreSQL username
  host: "localhost",
  database: "civicdb",        // replace with your DB name
  password: "shani@0802123",  // your PostgreSQL password
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err: Error) => console.error("❌ DB connection error", err));

// ✅ Use auth routes AFTER app is created
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Civic Sense Backend is running!");
});

// Example: test DB route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
