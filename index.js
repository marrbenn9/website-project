const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // To make HTTP requests

const client = require('./db'); // your database connection
const { validate, enterData, updateData, deleteRow, viewSelectedColumns } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST routes
app.post('/validate', async (req, res) => {
  const data = req.body.data;
  const table = req.body.table;
  const column = req.body.column;
  const isValid = await validate(data, table, column);
  res.json({ success: isValid });
});

app.post('/enterData', async (req, res) => {
  const data = req.body.data;
  const table = req.body.table;
  const column = req.body.column;
  const status = await enterData(data, table, column);
  res.json({ success: status });
});

app.post('/updateData', async (req, res) => {
  const data = req.body.data;
  const table = req.body.table;
  const column = req.body.column;
  const key = req.body.key;
  const value = req.body.value;
  const status = await updateData(data, table, column, key, value);
  res.json({ success: status });
});

app.post('/viewSelectedColumns', async (req, res) => {
  const data = req.body.data;
  const table = req.body.table;
  const column = req.body.column; // Should be an array
  const isValid = await viewSelectedColumns(data, table, column);
  res.json({ success: isValid });
});

app.post('/deleteRow', async (req, res) => {
  const data = req.body.data;
  const table = req.body.table;
  const column = req.body.column;
  const isValid = await deleteRow(data, table, column);
  res.json({ success: isValid });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// GET routes for pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/createacct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'createacct.html'));
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

// Scrape route using ProxyCrawl API
app.post('/scrape', async (req, res) => {
  const url = req.body.url;
  const selector = '.nr2Gp'; // adjust as needed

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // ProxyCrawl API URL with your token
    const proxycrawlUrl = `https://api.proxycrawl.com/?token=ZYqRo7OJpCzWUckPnkz-sA&url=${encodeURIComponent(url)}`;

    // Fetch the page content through ProxyCrawl
    const response = await fetch(proxycrawlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                      '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch content via ProxyCrawl' });
    }

    const html = await response.text();

    // Use a DOM parser like cheerio to extract the selector content
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);

    // Wait simulation workaround for lazy loading is not possible here,
    // so this depends on how ProxyCrawl fetches the rendered page.
    const element = $(selector).html();

    if (!element) {
      return res.status(404).json({ error: `Selector '${selector}' not found in page content` });
    }

    res.json({ element });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape content' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
