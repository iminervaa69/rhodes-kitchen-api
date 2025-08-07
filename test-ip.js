const { Client } = require('pg')

// Windows DNS workaround - use IP directly
async function test() {
  try {
    // First try to get the IP using Node's built-in DNS
    const dns = require('dns').promises
    
    console.log('Attempting manual DNS resolution...')
    
    // Try different DNS servers
    const resolver = new dns.Resolver()
    resolver.setServers(['1.1.1.1', '8.8.8.8']) // Cloudflare + Google DNS
    
    try {
      const addresses = await resolver.resolve4('db.ksipggipeogyohuosins.supabase.co')
      console.log('Resolved addresses:', addresses)
      
      // Use the first IP address
      const client = new Client({
        host: addresses[0], // Use IP directly
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: '@*v5EkQmm391Ab$203JG',
        ssl: {
          rejectUnauthorized: false,
          servername: 'db.ksipggipeogyohuosins.supabase.co' // But keep the original hostname for SSL
        }
      })

      await client.connect()
      console.log('✅ Connected successfully using IP!')
      
      const result = await client.query('SELECT version()')
      console.log('Database version:', result.rows[0].version)
      
      await client.end()
      
    } catch (dnsError) {
      console.log('DNS resolution failed, trying pooled connection...')
      
      // Fallback to pooled connection
      const client = new Client({
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        database: 'postgres',
        user: 'postgres.ksipggipeogyohuosins',
        password: '@*v5EkQmm391Ab$203JG',
        ssl: {
          rejectUnauthorized: false
        }
      })
      
      await client.connect()
      console.log('✅ Connected successfully using pooled connection!')
      
      const result = await client.query('SELECT version()')
      console.log('Database version:', result.rows[0].version)
      
      await client.end()
    }
    
  } catch (error) {
    console.error('❌ All connection attempts failed:', error.message)
  }
}

test()