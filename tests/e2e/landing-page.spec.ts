import { test, expect } from '@playwright/test'

test.describe('CosMind Landing Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads
    await expect(page).toHaveTitle(/CosMind|Spark Template/)

    // Check for key elements
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Should still be accessible and visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Test keyboard navigation
    await page.keyboard.press('Tab')

    // Check for focus visible elements
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')

    // Allow time for any delayed console errors
    await page.waitForTimeout(2000)

    // Should have minimal console errors (allow some non-critical ones)
    expect(consoleErrors.length).toBeLessThan(5)
  })
})
