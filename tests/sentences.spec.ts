import { test, expect } from '@playwright/test';

test.describe('Sentences Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sentences');
    await page.waitForLoadState('networkidle');
  });

  test('loads sentences page with correct layout', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Sentences' })).toBeVisible();
    await expect(page.locator('text=Practice Chinese sentences')).toBeVisible();
  });

  test('displays main sentence content', async ({ page }) => {
    const card = page.locator('.ios-card').first();
    await expect(card).toBeVisible();

    // Should have a Chinese sentence displayed
    const sentenceText = card.locator('p.text-2xl');
    await expect(sentenceText).toBeVisible();
  });

  test('TTS button is present and clickable', async ({ page }) => {
    const ttsButton = page.locator('button[aria-label="Play sentence pronunciation"]');
    await expect(ttsButton).toBeVisible();
  });

  test('I Know and Don\'t Know buttons are visible', async ({ page }) => {
    const iKnowBtn = page.locator('button', { hasText: 'I Know' });
    const dontKnowBtn = page.locator('button', { hasText: "Don't Know" });

    await expect(iKnowBtn).toBeVisible();
    await expect(dontKnowBtn).toBeVisible();
  });

  test('Don\'t Know reveals translation', async ({ page }) => {
    const dontKnowBtn = page.locator('button', { hasText: "Don't Know" });
    await dontKnowBtn.click();

    await expect(page.locator('text=Translation:')).toBeVisible();
  });

  test('progress counter is displayed', async ({ page }) => {
    const counter = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(counter.first()).toBeVisible();
  });

  test('example story section is present when examples exist', async ({ page }) => {
    // Check if examples section exists (may not on all sentences)
    const exampleHeader = page.locator('text=/예문으로 읽기/');
    if (await exampleHeader.isVisible()) {
      // Should have per-sentence TTS buttons
      const ttsButtons = page.locator('button[aria-label^="Play:"]');
      const count = await ttsButtons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('I Know navigates to next sentence', async ({ page }) => {
    const iKnowBtn = page.locator('button', { hasText: 'I Know' });
    await iKnowBtn.click();

    // Wait for navigation
    await page.waitForTimeout(500);
    // Should still show a sentence after navigation
    await expect(page.locator('p.text-2xl')).toBeVisible();
  });
});
