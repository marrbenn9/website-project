
const client = require('./db'); // <-- import the db connection
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const { validate } = require('./db')
const { enterData } = require('./db')
const { updateData } = require('./db')
const { deleteRow } = require('./db')
const { viewSelectedColumns } = require('./db')


app.use(express.json());

// post routes

app.post('/validate', async (req, res) => {
  const data = req.body.data
  const table = req.body.table
  const column = req.body.column
  const isValid = await validate(data, table, column)
  res.json({success: isValid})
})


app.post('/enterData', async (req, res) => {
  const data = req.body.data
  const table = req.body.table
  const column = req.body.column
  const status = await enterData(data, table, column)
  res.json({success: status})
})

app.post('/updateData', async (req, res) => {
  const data = req.body.data
  const table = req.body.table
  const column = req.body.column
  const key = req.body.key
  const value = req.body.value
  const status = await updateData(data, table, column, key, value)
  res.json({success: status})
})


app.post('/viewSelectedColumns', async (req, res) => {
  const data = req.body.data
  const table = req.body.table
  const column = req.body.column
  const isValid = await viewSelectedColumns(data, table, column) // * ONLY COLUMN SHOULD BE ARRAY HERE *
  res.json({success: isValid})
})


app.post('/deleteRow', async (req, res) => {
  const data = req.body.data
  const table = req.body.table
  const column = req.body.column
  const isValid = await deleteRow(data, table, column) 
  res.json({success: isValid})
})




// ✅ Serve static files first
app.use(express.static(path.join(__dirname, 'public')));

// Optional root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ✅ Route for /edit
app.get('/edit', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});


app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/createacct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'createacct.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});


app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});


app.get('/song_catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'song_catalog.html'));
});


app.get('/songs/:title', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'song_content.html'));
});


app.get('/ccbcAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});



