import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth";
import issueRoutes from "./routes/issues";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Railway PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:XkSSGOybkcMWgXTXqoefPKPzzozBrsOn@metro.proxy.rlwy.net:46631/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err: Error) => console.error("❌ DB connection error", err));

// Routes
app.use("/auth", authRoutes);
app.use("/issues", issueRoutes(io));
app.use("/api", authRoutes);
app.use("/api", issueRoutes(io));

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

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
