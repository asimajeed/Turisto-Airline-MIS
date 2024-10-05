import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

pool.on('error', (err: Error, client: any) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const query = (text: string, params?: any[]) => pool.query(text, params);

export { query };
