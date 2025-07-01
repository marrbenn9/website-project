const { Client } = require('pg');

const client = new Client({
  host: 'dpg-d1htccbipnbc73fml8ag-a.oregon-postgres.render.com',     // your database hostname
  port: 5432,   // usually stays 5432
  user: 'website_db_u8wx_user',     // your database username
  password: 'irmhgdOFA476cjCe9XVReFh0yZrIotqK', // your database password
  database: 'website_db_u8wx', // your database name
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Connection error:', err.stack));


client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
  );
`)
.then(() => console.log('✅ Table created (or already exists)'))
.catch(err => console.error('❌ Error creating table:', err));


client.query(`
  INSERT INTO users (name, email)
  VALUES ('Alice Johnson', 'alice@example.com')
  ON CONFLICT (email) DO NOTHING;
`)
.then(() => console.log('✅ Sample user inserted'))
.catch(err => console.error('❌ Error inserting user:', err));


client.query('SELECT * FROM users')
  .then(result => {
    console.log('📦 All users from the database:');
    console.table(result.rows);
  })
  .catch(err => console.error('❌ Error fetching users:', err));






const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Allows your backend to read JSON bodies

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from your backend server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
