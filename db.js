const { Pool } = require('pg')

const dbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000,
} : {
  host: process.env.DB_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres.ksipggipeogyohuosins',
  password: process.env.DB_PASSWORD || '@*v5EkQmm391Ab$203JG',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000,
}

const pool = new Pool(dbConfig)

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('✅ Database connected successfully!')
    
    const result = await client.query('SELECT NOW()')
    console.log('Current time:', result.rows[0].now)
    
    client.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error.message)
    throw error
  }
}

async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was: ${client.lastQuery}`)
  }, 5000)
  
  client.query = (...args) => {
    client.lastQuery = args
    return query.apply(client, args)
  }
  
  client.release = () => {
    clearTimeout(timeout)
    client.query = query
    client.release = release
    return release.apply(client)
  }
  
  return client
}

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...')
  pool.end(() => {
    console.log('Database pool has ended')
    process.exit(0)
  })
})

module.exports = {
  pool,
  query,
  getClient,
  testConnection
}