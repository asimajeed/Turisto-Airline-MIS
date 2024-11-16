import { Client } from "pg";
import * as dotenv from "dotenv";
import * as readline from "readline";
import * as fs from "fs";

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
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to connect to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database!");
    console.log(
      "PostgreSQL version:",
      (await client.query("SELECT VERSION()")).rows[0].version
    );
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

// Function to list all tables and their fields
async function listTables() {
  try {
    const result = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    console.log(result);
    const tables = result.rows.reduce((acc: any, row: any) => {
      acc[row.table_name] = acc[row.table_name] || [];
      acc[row.table_name].push(row.column_name);
      return acc;
    }, {});

    console.log("Tables and their fields:", JSON.stringify(tables, null, 2));
  } catch (err) {
    console.error("Error listing tables:", err);
  }
}

// Function to read a file and execute its content
async function useFile(fileName: string) {
  try {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    console.log(fileContent);
    await executeQuery(fileContent);
  } catch (err) {
    console.error("Error reading or executing file:", err);
  }
}

// Function to execute queries
async function executeQuery(query: string) {
  try {
    const result = await client.query(query);
    console.log("Query result:", result);
  } catch (err) {
    console.error("Query error:", err);
  }
}

// Start
async function startApp() {
  await connectToDatabase();
  console.log(
    "Enter your SQL queries below (type 'exit' to quit or 'tables' to list all tables):"
  );

  let queryBuffer = "";

  rl.on("line", async (input) => {
    if (input.trim().toLowerCase() === "exit") {
      console.log("Exiting...");
      await client.end();
      rl.close();
      return;
    } else if (input.trim().toLowerCase() === "tables") {
      await listTables();
    } else if (input.startsWith("use file")) {
      const fileName = input.split(" ")[2];
      await useFile(fileName);
    } else {
      queryBuffer += input + "\n"; // Accumulate the input
      if (input.trim().endsWith(";")) {
        // Execute the query if it ends with a semicolon
        await executeQuery(queryBuffer.trim());
        queryBuffer = ""; // Clear the buffer
      }
    }
  });
}

startApp();
