import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('has title and dashboard layout', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1', { hasText: '包子 HSK 3' })).toBeVisible();

    await expect(page.locator('h2', { hasText: 'Vocabulary' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Sentences' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Reading' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Writing' })).toBeVisible();
  });

  test('navigation to vocabulary tab works', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href="/vocabulary"]').first().click();

    await expect(page).toHaveURL(/.*vocabulary/);
    await expect(page.locator('h1', { hasText: 'Vocabulary' })).toBeVisible();
  });
});
