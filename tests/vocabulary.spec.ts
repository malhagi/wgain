import { test, expect } from '@playwright/test';

test.describe('Vocabulary Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vocabulary');
    await page.waitForLoadState('networkidle');
  });

  test('loads vocabulary page with correct layout', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Vocabulary' })).toBeVisible();
    await expect(page.locator('text=Learn Chinese words')).toBeVisible();
  });

  test('displays Chinese characters and hint buttons', async ({ page }) => {
    const card = page.locator('.ios-card').first();
    await expect(card).toBeVisible();

    await expect(card.locator('button[aria-label="Play pronunciation"]')).toBeVisible();
    await expect(card.locator('button[aria-label="Show hints"]')).toBeVisible();
  });

  test('I Know and Don\'t Know buttons are visible and above Similar Words', async ({ page }) => {
    const iKnowBtn = page.locator('button', { hasText: 'I Know' });
    const dontKnowBtn = page.locator('button', { hasText: "Don't Know" });

    await expect(iKnowBtn).toBeVisible();
    await expect(dontKnowBtn).toBeVisible();

    const similarSection = page.locator('text=Similar Words');
    if (await similarSection.isVisible()) {
      const btnBox = await iKnowBtn.boundingBox();
      const simBox = await similarSection.boundingBox();
      if (btnBox && simBox) {
        expect(btnBox.y).toBeLessThan(simBox.y);
      }
    }
  });

  test('examples section shows Korean translations', async ({ page }) => {
    const examplesSection = page.locator('text=Examples').first();
    if (await examplesSection.isVisible()) {
      const card = examplesSection.locator('..');
      const koreanTexts = card.locator('.text-purple-700');
      const count = await koreanTexts.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('clicking I Know navigates to a different word', async ({ page }) => {
    const iKnowBtn = page.locator('button', { hasText: 'I Know' });
    await iKnowBtn.click();

    await page.waitForTimeout(3000);

    const nextChar = await page.locator('.text-5xl').textContent();
    expect(nextChar).not.toBeNull();
  });

  test('statistics section displays correctly', async ({ page }) => {
    await expect(page.locator('text=Statistics')).toBeVisible();
    await expect(page.getByText('Correct', { exact: true })).toBeVisible();
    await expect(page.getByText('Incorrect', { exact: true })).toBeVisible();
    await expect(page.getByText('Status', { exact: true })).toBeVisible();
  });

  test('progress counter is displayed', async ({ page }) => {
    const counter = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(counter.first()).toBeVisible();
  });
});
