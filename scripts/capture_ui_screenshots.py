#!/usr/bin/env python3
"""
Diffraction UI Screenshot Automation via Playwright.
Captures high-resolution desktop and mobile responsive views of the B2B SaaS platform.
"""

import os
import shutil
import time
from playwright.sync_api import sync_playwright

SCREENSHOTS_DIR = "storage/screenshots"
ARTIFACTS_DIR = "/Users/hrushi/.gemini/antigravity/brain/8fda2cf5-92a2-43af-8031-10b7495212e4"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def capture_all():
    print("[Playwright] Launching Chromium browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop Viewport (1440x900)
        desktop_context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2
        )
        page = desktop_context.new_page()
        
        print("[Playwright] Navigating to http://localhost:8080...")
        page.goto("http://localhost:8080", wait_until="networkidle")
        time.sleep(1)

        # Overview View Screenshot
        overview_path = os.path.join(SCREENSHOTS_DIR, "saas_overview_desktop.png")
        page.screenshot(path=overview_path, full_page=False)
        print(f"Captured: {overview_path}")

        # Navigate to Audit Console & Run Complete Audit
        print("[Playwright] Loading Optical Glare incident in Audit Console...")
        page.click("#navConsole")
        time.sleep(0.5)
        # Click Glare hazard selector
        page.click("#btnHazardGlare")
        time.sleep(1.5)

        print("[Playwright] Executing complete verification audit on Optical Glare...")
        page.click("#runPipelineBtn")
        # Wait for audit completion
        page.wait_for_selector("#artifactsCard:not(.hidden)", timeout=15000)
        time.sleep(1)

        console_path = os.path.join(SCREENSHOTS_DIR, "saas_console_desktop.png")
        page.screenshot(path=console_path, full_page=False)
        print(f"Captured: {console_path}")

        # Capture Paywall Locked State (Scroll down to Remediation code container)
        page.locator("#remediationCodeContainer").scroll_into_view_if_needed()
        time.sleep(0.5)
        locked_path = os.path.join(SCREENSHOTS_DIR, "saas_paywall_locked.png")
        page.screenshot(path=locked_path, full_page=False)
        print(f"Captured: {locked_path}")

        # Click Unlock Pilot to open Paywall Modal
        print("[Playwright] Opening Paywall Modal...")
        page.click("#unlockPilotRemediationBtn")
        time.sleep(0.8)
        modal_path = os.path.join(SCREENSHOTS_DIR, "saas_paywall_modal.png")
        page.screenshot(path=modal_path, full_page=False)
        print(f"Captured: {modal_path}")

        # Apply Demo Unlock in modal
        print("[Playwright] Applying demo unlock key...")
        page.click("button:has-text('diff_demo_access')")
        time.sleep(1.5)

        # Capture Unlocked State
        unlocked_path = os.path.join(SCREENSHOTS_DIR, "saas_paywall_unlocked.png")
        page.screenshot(path=unlocked_path, full_page=False)
        print(f"Captured: {unlocked_path}")

        # Navigate to Telematics & Underwriting
        print("[Playwright] Navigating to Telematics & Insurance Underwriting...")
        page.click("#navTelematics")
        time.sleep(0.8)
        telematics_path = os.path.join(SCREENSHOTS_DIR, "saas_telematics_desktop.png")
        page.screenshot(path=telematics_path, full_page=False)
        print(f"Captured: {telematics_path}")

        # Navigate to Dynamic Safety Governor Playground
        print("[Playwright] Navigating to Dynamic Edge Safety Governor...")
        page.click("#navGovernor")
        time.sleep(0.8)
        governor_path = os.path.join(SCREENSHOTS_DIR, "saas_governor_desktop.png")
        page.screenshot(path=governor_path, full_page=False)
        print(f"Captured: {governor_path}")

        desktop_context.close()

        # 2. Mobile Viewport (iPhone 14 Pro: 393 x 852)
        print("[Playwright] Setting up mobile viewport (393 x 852)...")
        mobile_context = browser.new_context(
            viewport={"width": 393, "height": 852},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        mobile_page = mobile_context.new_page()
        mobile_page.goto("http://localhost:8080", wait_until="networkidle")
        time.sleep(1)

        # Mobile Overview
        mobile_overview_path = os.path.join(SCREENSHOTS_DIR, "saas_mobile_overview.png")
        mobile_page.screenshot(path=mobile_overview_path, full_page=False)
        print(f"Captured: {mobile_overview_path}")

        # Open Mobile Navigation Drawer
        mobile_page.click("button[aria-label='Toggle Navigation Menu']")
        time.sleep(0.5)
        mobile_drawer_path = os.path.join(SCREENSHOTS_DIR, "saas_mobile_drawer.png")
        mobile_page.screenshot(path=mobile_drawer_path, full_page=False)
        print(f"Captured: {mobile_drawer_path}")

        # Navigate to Audit Console on Mobile via visible drawer link
        mobile_page.click("#mobileDrawer a:has-text('Audit Console')")
        time.sleep(1)
        mobile_page.click("#btnHazardSlip")
        time.sleep(1.5)
        mobile_page.click("#runPipelineBtn")
        mobile_page.wait_for_selector("#artifactsCard:not(.hidden)", timeout=15000)
        time.sleep(1)

        mobile_console_path = os.path.join(SCREENSHOTS_DIR, "saas_mobile_console.png")
        mobile_page.screenshot(path=mobile_console_path, full_page=False)
        print(f"Captured: {mobile_console_path}")

        mobile_context.close()
        browser.close()

    # Copy all screenshots to the artifact directory
    print(f"[Playwright] Copying screenshots to artifacts directory: {ARTIFACTS_DIR}...")
    for filename in os.listdir(SCREENSHOTS_DIR):
        if filename.endswith(".png"):
            src = os.path.join(SCREENSHOTS_DIR, filename)
            dst = os.path.join(ARTIFACTS_DIR, filename)
            shutil.copy2(src, dst)
            print(f"Copied to artifacts: {filename}")

    print("[Playwright] All screenshots successfully generated and persisted!")

if __name__ == "__main__":
    capture_all()
