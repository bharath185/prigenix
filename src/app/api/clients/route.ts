import { pool, initDb } from '@/lib/db'
import { NextResponse } from 'next/server'

let initialized = false

async function checkInit() {
  if (!initialized) {
    await initDb()
    initialized = true
  }
}

export async function GET() {
  try {
    await checkInit()
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC')
    
    const clients = result.rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      taxId: row.tax_id,
      status: row.status,
      createdAt: row.created_at
    }))
    
    return NextResponse.json(clients)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await checkInit()
    const body = await request.json()
    const { id, companyName, contactName, contactEmail, contactPhone, taxId, status } = body
    
    if (id) {
      // Update existing client
      const queryText = `
        UPDATE clients SET
          company_name = $1,
          contact_name = $2,
          contact_email = $3,
          contact_phone = $4,
          tax_id = $5,
          status = $6
        WHERE id = $7
        RETURNING *
      `
      const values = [companyName, contactName, contactEmail, contactPhone, taxId, status || 'Onboarding', id]
      const result = await pool.query(queryText, values)
      const row = result.rows[0]
      return NextResponse.json({
        id: row.id,
        companyName: row.company_name,
        contactName: row.contact_name,
        contactEmail: row.contact_email,
        contactPhone: row.contact_phone,
        taxId: row.tax_id,
        status: row.status,
        createdAt: row.created_at
      })
    } else {
      // Insert new client
      const queryText = `
        INSERT INTO clients (company_name, contact_name, contact_email, contact_phone, tax_id, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (company_name) DO UPDATE SET
          contact_name = EXCLUDED.contact_name,
          contact_email = EXCLUDED.contact_email,
          contact_phone = EXCLUDED.contact_phone,
          tax_id = EXCLUDED.tax_id,
          status = EXCLUDED.status
        RETURNING *
      `
      const values = [companyName, contactName, contactEmail, contactPhone, taxId, status || 'Onboarding']
      const result = await pool.query(queryText, values)
      const row = result.rows[0]
      return NextResponse.json({
        id: row.id,
        companyName: row.company_name,
        contactName: row.contact_name,
        contactEmail: row.contact_email,
        contactPhone: row.contact_phone,
        taxId: row.tax_id,
        status: row.status,
        createdAt: row.created_at
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await checkInit()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing client ID parameter' }, { status: 400 })
    }
    
    await pool.query('DELETE FROM clients WHERE id = $1', [id])
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
