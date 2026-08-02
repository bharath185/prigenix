import { pool, initDb } from '@/lib/db'
import { NextResponse } from 'next/server'

let initialized = false

async function checkInit() {
  if (!initialized) {
    await initDb()
    initialized = true
  }
}

export async function GET(request: Request) {
  try {
    await checkInit()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const result = await pool.query('SELECT * FROM documents WHERE id = $1', [id])
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      const row = result.rows[0]
      return NextResponse.json({
        id: row.id,
        type: row.type,
        clientName: row.client_name,
        subject: row.subject,
        status: row.status,
        total: row.total ? Number(row.total) : undefined,
        date: row.date,
        createdBy: row.created_by,
        clientLogo: row.client_logo,
        content: row.content
      })
    }
    
    const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC')
    const docs = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      clientName: row.client_name,
      subject: row.subject,
      status: row.status,
      total: row.total ? Number(row.total) : undefined,
      date: row.date,
      createdBy: row.created_by,
      clientLogo: row.client_logo,
      content: row.content
    }))
    
    return NextResponse.json(docs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await checkInit()
    const body = await request.json()
    const { id, type, clientName, subject, status, total, date, createdBy, clientLogo, content } = body
    
    const queryText = `
      INSERT INTO documents (id, type, client_name, subject, status, total, date, created_by, client_logo, content, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        type = EXCLUDED.type,
        client_name = EXCLUDED.client_name,
        subject = EXCLUDED.subject,
        status = EXCLUDED.status,
        total = EXCLUDED.total,
        date = EXCLUDED.date,
        created_by = EXCLUDED.created_by,
        client_logo = EXCLUDED.client_logo,
        content = EXCLUDED.content,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    
    const values = [id, type, clientName, subject, status, total || null, date, createdBy, clientLogo || null, content || null]
    const result = await pool.query(queryText, values)
    
    const row = result.rows[0]
    return NextResponse.json({
      id: row.id,
      type: row.type,
      clientName: row.client_name,
      subject: row.subject,
      status: row.status,
      total: row.total ? Number(row.total) : undefined,
      date: row.date,
      createdBy: row.created_by,
      clientLogo: row.client_logo,
      content: row.content
    })
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
      return NextResponse.json({ error: 'Missing document ID parameter' }, { status: 400 })
    }
    
    await pool.query('DELETE FROM documents WHERE id = $1', [id])
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
