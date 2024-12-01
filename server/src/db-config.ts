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
  timezone: "UTC",
};

let client: Client | null = null;

async function connectDB() {
  if (client) {
    return client;
  }

  client = new Client(config);

  try {
    await client.connect();
    console.log("Connected to the database!");
    const result = await client.query("SELECT VERSION()");
    console.log("PostgreSQL version:", result.rows[0].version);

  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }

  return client;
}

async function query(text: string, params?: any[]) {
  if (!client) {
    await connectDB();
  }

  try {
    const result = await client!.query(text, params);
    return result;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}

export { connectDB, query, client };

connectDB();
