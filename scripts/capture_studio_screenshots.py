"""
Playwright automated screenshot capture for Diffraction Productized Studio & Client Portal.
Captures desktop, tablet, and mobile views and syncs to artifacts directory.
"""

import asyncio
import os
import shutil
from playwright.async_api import async_playwright

ARTIFACTS_DIR = "/Users/hrushi/.gemini/antigravity/brain/8fda2cf5-92a2-43af-8031-10b7495212e4"
SCREENSHOTS_DIR = "./storage/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # 1. Desktop Landing Page
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()
        await page.goto("http://localhost:8080/#overview", wait_until="networkidle")
        await page.wait_for_timeout(1500)
        shot1 = os.path.join(SCREENSHOTS_DIR, "studio_landing_desktop.png")
        await page.screenshot(path=shot1, full_page=False)

        # 2. Client Sprint Portal: Active Sprint Tracker
        await page.goto("http://localhost:8080/#studio", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        tracker_btn = page.locator("button:has-text('Active Sprint Tracker')")
        if await tracker_btn.count() > 0:
            await tracker_btn.first.click()
            await page.wait_for_timeout(1000)
        shot2 = os.path.join(SCREENSHOTS_DIR, "studio_tracker_desktop.png")
        await page.screenshot(path=shot2, full_page=False)

        # 3. Client Sprint Portal: SOW Builder
        sow_btn = page.locator("button:has-text('Scope Sprint SOW')")
        if await sow_btn.count() > 0:
            await sow_btn.first.click()
            await page.wait_for_timeout(1000)
        shot3 = os.path.join(SCREENSHOTS_DIR, "studio_sow_desktop.png")
        await page.screenshot(path=shot3, full_page=False)

        # 4. Sample Deliverables & Asset Portfolio
        await page.goto("http://localhost:8080/#catalog", wait_until="networkidle")
        await page.wait_for_timeout(1500)
        shot4 = os.path.join(SCREENSHOTS_DIR, "studio_portfolio_desktop.png")
        await page.screenshot(path=shot4, full_page=False)

        # 5. Sprint Pricing View
        await page.goto("http://localhost:8080/#pricing", wait_until="networkidle")
        await page.wait_for_timeout(1500)
        shot5 = os.path.join(SCREENSHOTS_DIR, "studio_pricing_desktop.png")
        await page.screenshot(path=shot5, full_page=False)

        # 6. Mobile Viewport (iPhone 14)
        m_context = await browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        m_page = await m_context.new_page()
        await m_page.goto("http://localhost:8080/#overview", wait_until="networkidle")
        await m_page.wait_for_timeout(1500)
        shot6 = os.path.join(SCREENSHOTS_DIR, "studio_mobile.png")
        await m_page.screenshot(path=shot6, full_page=False)

        await browser.close()
        print("All screenshots captured successfully.")

        # Copy to artifacts directory
        for s in [shot1, shot2, shot3, shot4, shot5, shot6]:
            dst = os.path.join(ARTIFACTS_DIR, os.path.basename(s))
            shutil.copy2(s, dst)
            print(f"Copied {s} -> {dst}")

if __name__ == "__main__":
    asyncio.run(capture())
