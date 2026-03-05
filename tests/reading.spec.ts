import { test, expect } from '@playwright/test';

test.describe('Reading Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reading');
    await page.waitForLoadState('networkidle');
  });

  test('loads reading page with correct layout', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Listening' })).toBeVisible();
    await expect(page.locator('text=Listen and comprehend')).toBeVisible();
  });

  test('shows phase indicator with Listen, Quiz, Text steps', async ({ page }) => {
    await expect(page.locator('text=Listen')).toBeVisible();
    await expect(page.locator('text=Quiz')).toBeVisible();
    await expect(page.locator('text=Text')).toBeVisible();
  });

  test('displays reading title in listening phase', async ({ page }) => {
    const card = page.locator('.ios-card').first();
    await expect(card).toBeVisible();

    const title = card.locator('h2');
    await expect(title).toBeVisible();
  });

  test('TTS play button is visible in listening phase', async ({ page }) => {
    const playButton = page.locator('button[aria-label="Play passage audio"]');
    await expect(playButton).toBeVisible();
  });

  test('Start Quiz button appears after listening', async ({ page }) => {
    // Click play button to trigger hasListened
    const playButton = page.locator('button[aria-label="Play passage audio"]');
    await playButton.click();

    // Wait for TTS to "play" (even if no audio in test env)
    await page.waitForTimeout(2000);

    const startQuizBtn = page.locator('button', { hasText: 'Start Quiz' });
    await expect(startQuizBtn).toBeVisible({ timeout: 10000 });
  });

  test('quiz phase shows questions with options', async ({ page }) => {
    // Trigger listening
    const playButton = page.locator('button[aria-label="Play passage audio"]');
    await playButton.click();
    await page.waitForTimeout(2000);

    // Move to quiz
    const startQuizBtn = page.locator('button', { hasText: 'Start Quiz' });
    await startQuizBtn.click({ timeout: 10000 });

    // Should see question text and submit button
    await expect(page.locator('button', { hasText: 'Submit Answers' })).toBeVisible();
  });

  test('progress counter is displayed', async ({ page }) => {
    const counter = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(counter.first()).toBeVisible();
  });
});
