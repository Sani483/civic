const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:XkSSGOybkcMWgXTXqoefPKPzzozBrsOn@metro.proxy.rlwy.net:46631/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);
    console.log('✅ Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();