import { chromium } from 'playwright';

const baseURL = 'http://localhost:3000';
const url = `${baseURL}/sentences`;

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const consoleLogs = [];
page.on('console', (msg) => {
  const type = msg.type();
  const text = msg.text();
  consoleLogs.push({ type, text });
});

try {
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  console.log('Status:', response?.status());
  
  // Check for Next.js error overlay
  const errorOverlay = await page.$('[data-nextjs-dialog]');
  const errorText = errorOverlay ? await errorOverlay.textContent() : null;
  
  if (errorText) {
    console.log('ERROR OVERLAY:', errorText);
  }
  
  // Check for common error elements
  const errorDiv = await page.$('.nextjs-toast-errors');
  if (errorDiv) {
    console.log('TOAST ERROR:', await errorDiv.textContent());
  }
  
  await page.screenshot({ path: 'tmp/sentences-screenshot.png', fullPage: true });
  console.log('Screenshot saved to tmp/sentences-screenshot.png');
  
  // Log console errors
  const errors = consoleLogs.filter(l => l.type === 'error');
  if (errors.length > 0) {
    console.log('CONSOLE ERRORS:');
    errors.forEach(e => console.log(' -', e.text));
  }
  
  // Log all console output for debugging
  console.log('All console messages:', JSON.stringify(consoleLogs, null, 2));
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await browser.close();
}
