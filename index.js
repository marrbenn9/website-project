const express = require('express');
const path = require('path');
const { chromium } = require('playwright');


const { execSync } = require('child_process');

const client = require('./db'); // <-- import the db connection
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

// Scrape route
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

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                 '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 6000 }
    });

    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Wait for JS lazy loading
    await page.waitForTimeout(3000);

    // Wait for the element selector
    await page.waitForSelector(selector, { timeout: 10000 });

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

// Ensure Chromium installed before starting server
async function ensureChromium() {
  try {
    const executablePath = chromium.executablePath();
    if (!executablePath) throw new Error('Chromium executable not found');
  } catch (err) {
    console.log('Chromium not found, installing...');
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  }
}

// Start server after Chromium check/install
(async () => {
  await ensureChromium();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
