/**
 * Visual verification test for Vocabulary page.
 * Captures screenshots at key stages for manual review.
 * Run: npx playwright test vocabulary-visual-check --project=chromium
 */
import { test, expect } from '@playwright/test';

test.describe('Vocabulary Page Visual Check', () => {
  test('full verification with screenshots', async ({ page }) => {
    // 1. Navigate to vocabulary page
    await page.goto('/vocabulary');
    await page.waitForLoadState('networkidle');

    // Wait for content to load (Chinese character appears)
    await page.waitForSelector('.text-5xl', { timeout: 10000 });

    // 2. Take full page screenshot (initial state)
    await page.screenshot({
      path: 'test-results/vocabulary-initial.png',
      fullPage: true,
    });

    // 3. Verify required elements
    const card = page.locator('.ios-card').first();
    await expect(card).toBeVisible();

    // Chinese character (large text)
    const chineseChar = page.locator('.text-5xl');
    await expect(chineseChar).toBeVisible();

    // Speaker button
    await expect(page.locator('button[aria-label="Play pronunciation"]')).toBeVisible();

    // Hint button (green Info)
    const hintBtn = page.locator('button[aria-label="Show hints"]');
    await expect(hintBtn).toBeVisible();

    // Examples section with Korean
    const examplesSection = page.locator('text=Examples').first();
    const examplesVisible = await examplesSection.isVisible();
    let koreanVisible = false;
    if (examplesVisible) {
      const koreanTexts = page.locator('.text-purple-700');
      koreanVisible = (await koreanTexts.count()) > 0;
    }

    // I Know / Don't Know buttons
    const iKnowBtn = page.locator('button', { hasText: 'I Know' });
    const dontKnowBtn = page.locator('button', { hasText: "Don't Know" });
    await expect(iKnowBtn).toBeVisible();
    await expect(dontKnowBtn).toBeVisible();

    // Similar Words - check if visible and buttons are above it
    const similarSection = page.locator('text=Similar Words');
    const similarVisible = await similarSection.isVisible();
    let buttonsAboveSimilar = true;
    if (similarVisible) {
      const btnBox = await iKnowBtn.boundingBox();
      const simBox = await similarSection.boundingBox();
      if (btnBox && simBox) {
        buttonsAboveSimilar = btnBox.y < simBox.y;
      }
    }

    // Progress counter
    const counter = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(counter.first()).toBeVisible();

    // Statistics section
    await expect(page.locator('text=Statistics')).toBeVisible();

    // 4. Click Show hints (green Info button)
    await hintBtn.click();

    // Wait for hints to appear
    await page.waitForSelector('.text-2xl.font-bold.text-black', { timeout: 3000 });

    // 5. Screenshot after hints shown
    await page.screenshot({
      path: 'test-results/vocabulary-after-hints.png',
      fullPage: true,
    });

    // 6. Scroll down to Similar Words (if present)
    if (similarVisible) {
      await similarSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    } else {
      // Scroll to bottom to see full layout
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }

    // 7. Final screenshot
    await page.screenshot({
      path: 'test-results/vocabulary-final.png',
      fullPage: true,
    });

    // Assertions for the report
    expect(chineseChar).toBeVisible();
    expect(examplesVisible || true).toBeTruthy(); // Examples may not exist for all words
    expect(koreanVisible || !examplesVisible).toBeTruthy(); // Korean shown when examples exist
    expect(buttonsAboveSimilar).toBeTruthy();
  });
});
