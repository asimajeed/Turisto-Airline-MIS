import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA,
  },
};

const client = new Client(config);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to the database!");
    const result = await client.query("SELECT VERSION()");
    console.log("PostgreSQL version:", result.rows[0].version);
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

async function query(text: string, params?: any[]) {
  try {
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}

export { connectDB, query, client };

connectDB();
