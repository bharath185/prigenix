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
      type VARCHAR(50) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      subject TEXT NOT NULL,
      status VARCHAR(20) NOT NULL,
      total NUMERIC,
      date VARCHAR(50) NOT NULL,
      created_by VARCHAR(50) NOT NULL,
      client_logo TEXT,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) UNIQUE NOT NULL,
      contact_name VARCHAR(255) NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      contact_phone VARCHAR(50),
      tax_id VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'Onboarding',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  const alterQuery = `
    ALTER TABLE documents ALTER COLUMN type TYPE VARCHAR(50);
    ALTER TABLE documents ADD COLUMN IF NOT EXISTS content TEXT;
  `
  try {
    const client = await pool.connect()
    await client.query(queryText)
    await client.query(alterQuery)
    client.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}
