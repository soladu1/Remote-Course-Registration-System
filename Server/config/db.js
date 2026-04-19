const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }, // For Supabase
});

pool.on("connect", () => console.log("PostgreSQL Connected"));
pool.on("error", (err) => console.error("PostgreSQL Error:", err));

module.exports = pool;
