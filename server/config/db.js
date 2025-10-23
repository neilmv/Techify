import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "techify_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
