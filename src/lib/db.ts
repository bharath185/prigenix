import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

// Initialize database tables
export async function initDb() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS documents (
      id VARCHAR(50) PRIMARY KEY,
      type VARCHAR(20) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      subject TEXT NOT NULL,
      status VARCHAR(20) NOT NULL,
      total NUMERIC,
      date VARCHAR(50) NOT NULL,
      created_by VARCHAR(50) NOT NULL,
      client_logo TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  try {
    const client = await pool.connect()
    await client.query(queryText)
    client.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}
