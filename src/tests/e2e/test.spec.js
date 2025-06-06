// https://playwright.dev/
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://monaka_app:3000/monaka/index.html');
  await expect(page).toHaveTitle(/Home/);
});

// test('Page Screenshot', async ({ page }) => {
//   await page.goto('http://localhost:3000/monaka/index.html');
//   await page.screenshot({ path: `example.png` });
// .toHaveScreenshot() // 前回撮影したスクリーンショットの結果と比較
// });
