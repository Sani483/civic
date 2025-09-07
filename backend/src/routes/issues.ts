import { Router } from "express";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:XkSSGOybkcMWgXTXqoefPKPzzozBrsOn@metro.proxy.rlwy.net:46631/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default function issueRoutes(io: any) {
  const router = Router();

  // Get all issues
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT i.*, u.name as userName 
        FROM issues i 
        JOIN users u ON i.user_id = u.id 
        ORDER BY i.created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create issue
  router.post("/", async (req, res) => {
    try {
      const { title, description, category, location, latitude, longitude, imageUrl, userId, userName } = req.body;
      
      const result = await pool.query(`
        INSERT INTO issues (title, description, category, location, latitude, longitude, user_id, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending') 
        RETURNING *
      `, [title, description, category, location, latitude, longitude, userId || 1]);

      const newIssue = { ...result.rows[0], userName: userName || 'Anonymous', upvotes: 0 };
      
      // Broadcast new issue
      io.emit('new_issue', newIssue);
      
      res.status(201).json(newIssue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Upvote issue
  router.post("/:id/upvote", async (req, res) => {
    try {
      const { id } = req.params;
      
      // For now, just return mock upvote - implement proper upvote table later
      const result = await pool.query(`
        SELECT i.*, u.name as userName 
        FROM issues i 
        JOIN users u ON i.user_id = u.id 
        WHERE i.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Issue not found" });
      }

      const issue = { ...result.rows[0], upvotes: (result.rows[0].upvotes || 0) + 1 };
      res.json(issue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update issue status (for authorities)
  router.put("/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, message } = req.body;
      
      await pool.query(`
        UPDATE issues SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [status, id]);

      const result = await pool.query(`
        SELECT i.*, u.name as userName 
        FROM issues i 
        JOIN users u ON i.user_id = u.id 
        WHERE i.id = $1
      `, [id]);

      const updatedIssue = { ...result.rows[0], upvotes: result.rows[0].upvotes || 0 };
      
      // Broadcast status update
      io.emit('issue_updated', updatedIssue);
      
      res.json(updatedIssue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
}