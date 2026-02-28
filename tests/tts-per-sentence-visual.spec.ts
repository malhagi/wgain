/**
 * Per-sentence TTS visual verification test
 * Checks vocabulary Examples section and sentences story section for TTS buttons
 */
import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'tts-screenshots');

test.describe('Per-sentence TTS Visual Check', () => {
  test.beforeAll(async () => {
    // Ensure screenshot directory exists
    const fs = await import('fs');
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test.describe('Desktop viewport', () => {
    test('vocabulary - Examples section has per-sentence TTS buttons', async ({ page }) => {
      await page.goto('/vocabulary');
      await page.waitForLoadState('networkidle');

      // Wait for content to load
      await page.waitForSelector('.ios-card', { timeout: 10000 });

      // Scroll to Examples section (purple area)
      const examplesSection = page.locator('text=Examples').first();
      await examplesSection.waitFor({ state: 'visible', timeout: 15000 });
      await examplesSection.scrollIntoViewIfNeeded();

      // Verify each example has a speaker button (aria-label contains "Play sentence")
      const ttsButtons = page.locator('[aria-label^="Play sentence:"]');
      const count = await ttsButtons.count();
      expect(count).toBeGreaterThan(0);

      // Verify buttons are properly sized (w-7 h-7 = 28px)
      const firstBtn = ttsButtons.first();
      const box = await firstBtn.boundingBox();
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
      }

      // Take screenshot
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'vocabulary-examples-desktop.png'),
        fullPage: false,
      });
    });

    test('sentences - story section has per-sentence TTS buttons', async ({ page }) => {
      await page.goto('/sentences');
      await page.waitForLoadState('networkidle');

      // Wait for content
      await page.waitForSelector('.ios-card', { timeout: 10000 });

      // Scroll to "예문으로 읽기" section
      const storyLabel = page.locator('text=예문으로 읽기');
      await storyLabel.waitFor({ state: 'visible', timeout: 15000 });
      await storyLabel.scrollIntoViewIfNeeded();

      // Verify each story sentence has a speaker button (aria-label contains "Play:")
      const ttsButtons = page.locator('[aria-label^="Play:"]');
      const count = await ttsButtons.count();
      expect(count).toBeGreaterThan(0);

      // Verify buttons are properly sized
      const firstBtn = ttsButtons.first();
      const box = await firstBtn.boundingBox();
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
      }

      // Take screenshot
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'sentences-story-desktop.png'),
        fullPage: false,
      });
    });
  });

  test.describe('Mobile viewport (375x812 iPhone)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('vocabulary - Examples section on mobile', async ({ page }) => {
      await page.goto('/vocabulary');
      await page.waitForLoadState('networkidle');

      await page.waitForSelector('.ios-card', { timeout: 10000 });

      const examplesSection = page.locator('text=Examples').first();
      await examplesSection.waitFor({ state: 'visible', timeout: 15000 });
      await examplesSection.scrollIntoViewIfNeeded();

      const ttsButtons = page.locator('[aria-label^="Play sentence:"]');
      const count = await ttsButtons.count();
      expect(count).toBeGreaterThan(0);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'vocabulary-examples-mobile.png'),
        fullPage: false,
      });
    });

    test('sentences - story section on mobile', async ({ page }) => {
      await page.goto('/sentences');
      await page.waitForLoadState('networkidle');

      await page.waitForSelector('.ios-card', { timeout: 10000 });

      const storyLabel = page.locator('text=예문으로 읽기');
      await storyLabel.waitFor({ state: 'visible', timeout: 15000 });
      await storyLabel.scrollIntoViewIfNeeded();

      const ttsButtons = page.locator('[aria-label^="Play:"]');
      const count = await ttsButtons.count();
      expect(count).toBeGreaterThan(0);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'sentences-story-mobile.png'),
        fullPage: false,
      });
    });
  });
});
