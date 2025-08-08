
const client = require('./db'); // <-- import the db connection
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { chromium } = require('playwright')


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


app.get('/import', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'import.html'));
});

app.post('/scrape', async (req, res) => {
  const url = req.body.url;
  const selector = '.nr2Gp'; // adjust as needed

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create context with user agent
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                 '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 6000 }
    });

    const page = await context.newPage();

    // Load HTML without waiting for all network requests
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Let JS render the lazy content
    await page.waitForTimeout(3000);

    // Wait specifically for the target selector
    await page.waitForSelector(selector, { timeout: 10000 });

    // Extract inner HTML of the element
    const content = await page.$eval(selector, el => el.cloneNode(true).innerHTML);

    res.json({ element: content });

  } catch (err) {
    console.error('Scraping error:', err.message || err);
    res.status(500).json({ error: 'Failed to scrape content' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});



