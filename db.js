const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_x7v8gciXCRwb@ep-billowing-wind-a1o1hcdv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('✅ Connected to Neon PostgreSQL database'))
  .catch(err => console.error('❌ Connection error:', err.stack));


client.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(100),
        name VARCHAR(100)
    );`)
    .then(() => console.log('user table successfully created or already exists'))
    .catch(err => console.error('Error: ', err))


client.query(`
  CREATE TABLE IF NOT EXISTS secrets (
    id SERIAL PRIMARY KEY,
    secret VARCHAR(100)
    
  );
`)
.then(() => console.log('✅ Secrets table created (or already exists)'))
.catch(err => console.error('❌ Error creating secrets table:', err));



client.query(`
    CREATE TABLE IF NOT EXISTS songs(
        id SERIAL PRIMARY KEY,
        title TEXT,
        artist TEXT,
        contributor TEXT,
        originalKey TEXT,
        chords TEXT[],
        lyrics TEXT[]

    );`)
    .then(() => console.log('✅ SONGS table successfully created or already exists'))
    .catch(err => console.error('Error: ', err))




// MY CUSTOM FUNCTIONS //

const validate = async (data, table, column) => {
  try {
    const res = await client.query(`SELECT * FROM ${table} WHERE ${column} = $1`, [data]);
    return res.rows
  } catch (err) {
    console.error('Error:', err);
    return false;
  }
};


const enterData = async (data, table, columns) => {
  try {
    const placeholders = data.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');

    await client.query(
      `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`,
      data
    );

    console.log(`✅ Inserted data into ${table} (${columnNames}): ${data}`);
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
};


const updateData = async (data, table, column, key, value) => {
  try {
    await client.query(`UPDATE ${table} SET ${column} = $1 WHERE ${key} = $2`, [data, value]);
    console.log(`✅ Updated ${table}.${column} to ${data} where ${key} = ${value}`);
    const res = await validate(value, 'songs', 'title')
    console.log(res)
    return true
  } catch (err) {
    console.error('❌ Error:', err);
  }
};






async function viewTable(tableName) {
  try {
    const res = await client.query(`SELECT * FROM ${tableName}`);
    console.log(`📋 Rows from table '${tableName}':`);
    console.table(res.rows);  // nice tabular display in console
  } catch (err) {
    console.error('❌ Error fetching data:', err);}
}

// Example usage:



const clearTable = async (table) => {
  try {
    await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    console.log(`✅ Truncated table ${table} (all rows removed, IDs reset)`);
    return true;
  } catch (err) {
    console.error('❌ Error truncating table:', err);
    return false;
  }
};




const viewSelectedColumns = async (placeholder, tableName, columns) => {
  try {
    const columnList = (columns.length === 1 && columns[0] === '*') ? '*' : columns.join(', ');
    const res = await client.query(`SELECT ${columnList} FROM ${tableName}`);
    console.log(placeholder)
    console.table(res.rows);
    return res.rows;
  } catch (err) {
    console.error('❌ Error fetching selected columns:', err);
  }
};

const deleteRow = async (data, table, column) => {
  try {
    const res = await client.query(`DELETE FROM ${table} WHERE ${column} = $1`, [data]);
    console.log(`🗑️ Deleted row(s) from '${table}' where ${column} = '${data}'`);
    return res.rowCount > 0;
  } catch (err) {
    console.error('❌ Error deleting row:', err);
    return false;
  }
};

// deleteRow('20', 'users', 'id')

viewTable('songs'); // replace 'songs' with your actual table name
viewTable('users')
viewTable('secrets')


module.exports = {
  client,
  validate,
  enterData,
  updateData,
  deleteRow,
  viewSelectedColumns
};