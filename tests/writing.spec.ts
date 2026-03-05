import { test, expect } from '@playwright/test';

test.describe('Writing Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/writing');
    await page.waitForLoadState('networkidle');
  });

  test('loads writing page with correct layout', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Writing' })).toBeVisible();
    await expect(page.locator('text=Practice Chinese writing')).toBeVisible();
  });

  test('shows topic selection list', async ({ page }) => {
    await expect(page.locator('text=Select Topic')).toBeVisible();

    // Should have multiple topics
    const topicButtons = page.locator('button:has-text("自我介绍"), button:has-text("我的家人"), button:has-text("我的爱好")');
    const count = await topicButtons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('displays difficulty labels', async ({ page }) => {
    await expect(page.locator('text=初级').first()).toBeVisible();
  });

  test('textarea is present and writable', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    await textarea.fill('我是学生。');
    await expect(textarea).toHaveValue('我是学生。');
  });

  test('character count updates on typing', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('我喜欢学习中文。');

    await expect(page.locator('text=Characters: 8')).toBeVisible();
  });

  test('preview section appears when text is entered', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('你好世界');

    await expect(page.locator('text=预览')).toBeVisible();
  });

  test('clear button resets text', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('测试文本');

    const clearBtn = page.locator('button', { hasText: 'Clear' });
    await clearBtn.click();

    await expect(textarea).toHaveValue('');
  });

  test('topic selection changes the writing area', async ({ page }) => {
    const secondTopic = page.locator('button:has-text("我的家人")');
    await secondTopic.click();

    await expect(page.locator('h2', { hasText: '我的家人' })).toBeVisible();
  });

  test('suggested words appear for topics with vocabulary', async ({ page }) => {
    // Select a topic with suggestedWords (e.g., 周末计划)
    const topic = page.locator('button:has-text("周末计划")');
    await topic.click();

    await expect(page.locator('text=推荐词汇')).toBeVisible();
  });
});
