const { install } = require('playwright/lib/install');

install('chromium')
  .then(() => {
    console.log('Chromium installed successfully');
  })
  .catch(err => {
    console.error('Playwright install failed:', err);
    process.exit(1);
  });
