import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://monaka_app:3000/monaka/index.html');
  await expect(page).toHaveTitle(/Home/);
});
