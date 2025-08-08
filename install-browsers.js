const { exec } = require('child_process');

exec('npx playwright install chromium', (error, stdout, stderr) => {
  if (error) {
    console.error(`Install error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Install stderr: ${stderr}`);
  }
  console.log(stdout);
});
