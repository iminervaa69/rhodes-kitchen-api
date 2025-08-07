const { Client } = require('pg')
require('dotenv').config()

async function test() {
  const client = new Client({
    host: 'db.ksipggipeogyohuosins.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '@*v5EkQmm391Ab$203JG', // Updated password
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Attempting to connect...')
    await client.connect()
    console.log('✅ Connected successfully!')
    
    const result = await client.query('SELECT version()')
    console.log('Database version:', result.rows[0].version)
    
    await client.end()
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  }
}

test()